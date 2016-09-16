package main

import (
	"encoding/base64"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"strings"

	"github.com/mitchellh/goamz/s3"
	"gopkg.in/mgo.v2/bson"
)

func (r *NewsletterRepo) UploadPackage(nl Newsletter) error {
	err := r.coll.Insert(nl)

	if err != nil {
		log.Println(err)
		return err
	}
	return err
}

func (r *NewsletterRepo) GetPackages() ([]Newsletter, error) {
	data := []Newsletter{}
	err := r.coll.Find(bson.M{}).All(&data)
	if err != nil {
		log.Println(err)
		return data, err
	}
	return data, nil

}

func (c *Config) SubmitPackageHandler(w http.ResponseWriter, r *http.Request) {
	data := Newsletter{}
	u := NewsletterRepo{c.MongoSession.DB(c.MONGODB).C("packages")}
	err := json.NewDecoder(r.Body).Decode(&data)
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
		err = u.UploadPackage(data)
		if err != nil {
			log.Println(err)
		}
	}

}

func (c *Config) GetPackagesHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("packages Handler")
	//u := NewsletterRepo{c.MongoSession.DB(c.MONGODB).C("packages")}

	//	packages, err := u.GetPackages()
	//if err != nil {
	//	log.Println(err)
	//}
	//log.Println(packages)

	p := Newsletter{
		Title:       "111",
		Description: "lorem ipsum",
		Image:       "http://placehold.it/300x300",
	}

	packages := []Newsletter{
		p,
	}
	t := template.New("packages template")             //create a new template
	t, err := t.ParseFiles("./frontend/packages.html") //open and parse a template text file
	if err != nil {
		log.Println(err)
	}

	t.ExecuteTemplate(w, "packages.html", packages) //substitute fields in the template 't', with values from 'user' and write it out to 'w' which implements io.Writer
}
