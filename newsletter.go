package main

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"strings"

	"github.com/mitchellh/goamz/s3"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Newsletter struct {
	ID          bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Title       string        `bson:"title"`
	Description string        `bson:"description"`
	Image       string        `bson:"image"`
	LetterNo    string        `bson:"letterno"`
}

type NewsletterRepo struct {
	coll *mgo.Collection
}

func randSeq(n int) string {
	letters := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func (r *NewsletterRepo) UploadLetter(nl Newsletter) error {
	err := r.coll.Upsert(bson.M{"letterno": nl.LetterNo}, nl)
	if err != nil {
		log.Println(err)
		return err
	}
}

func (r *NewsletterRepo) GetLetters() ([]Newsletter, error) {
	data := []Newsletter{}
	err := r.coll.Find(bson.M{}).All(&data)
	if err != nil {
		log.Println(err)
		return data, err
	}
	return data, nil

}

func (c *Config) GetLetterHandler(w http.ResponseWriter, r *http.Request) {
	u := NewsletterRepo{c.MongoSession.DB(c.MONGODB).C("newsletter")}
	data, err := u.GetLetters()
	if err != nil {
		log.Println(err)
	}
	res, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (c *Config) UploadHandler(w http.ResponseWriter, r *http.Request) {
	data := Newsletter{}
	u := NewsletterRepo{c.MongoSession.DB(c.MONGODB).C("newsletter")}
	err := json.NewDecoder(r.body).Decode(&data)
	if err != nil {
		log.Println(err)
	}
	if data.Image != "" {
		bucket := c.S3Bucket
		byt, err := base64.StdEncoding.DecodeString(strings.Split(data.Image, "base64,")[1])
		if err != nil {
			log.Println(err)
		}
		meta := strings.Split(data.Image, "base64,")[0]
		newmeta := strings.Replace(strings.Replace(meta, "data:", "", -1), ";", "", -1)
		name := randSeq(10) + data.LetterNo
		err = bucket.Put(name, byt, newmeta, s3.PublicReadWrite)
		if err != nil {
			log.Println(err)
		}
		data.Image = bucket.URL(name)
		err = u.UploadLetter(data)
		if err != nil {
			log.Println(err)
		}
	}

}
