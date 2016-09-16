package main

import (
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/mitchellh/goamz/s3"
	"gopkg.in/mgo.v2/bson"
)

type Gallery struct {
	Image string `bson:"image"`
}

func (r *NewsletterRepo) UploadGallery(nl Gallery) error {
	err := r.coll.Insert(nl)

	if err != nil {
		log.Println(err)
		return err
	}
	return err
}

func (r *NewsletterRepo) GetGallery() ([]Gallery, error) {
	data := []Gallery{}
	err := r.coll.Find(bson.M{}).All(&data)
	if err != nil {
		log.Println(err)
		return data, err
	}
	return data, nil

}

func (c *Config) UploadGalleryHandler(w http.ResponseWriter, r *http.Request) {
	data := Gallery{}
	u := NewsletterRepo{c.MongoSession.DB(c.MONGODB).C("gallery")}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		log.Println(err)
	}

	bucket := c.S3Bucket
	byt, err := base64.StdEncoding.DecodeString(strings.Split(data.Image, "base64,")[1])
	if err != nil {
		log.Println(err)
	}
	meta := strings.Split(data.Image, "base64,")[0]
	newmeta := strings.Replace(strings.Replace(meta, "data:", "", -1), ";", "", -1)
	name := randSeq(10) + "" + randSeq(10)
	err = bucket.Put(name, byt, newmeta, s3.PublicReadWrite)
	if err != nil {
		log.Println(err)
	}
	data.Image = bucket.URL(name)
	err = u.UploadGallery(data)
	if err != nil {
		log.Println(err)
	}
}

func (c *Config) GetGalleryHandler(w http.ResponseWriter, r *http.Request) {
	u := NewsletterRepo{c.MongoSession.DB(c.MONGODB).C("gallery")}
	data, err := u.GetGallery()
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
