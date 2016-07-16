package main

import (
	"encoding/json"

	//	"github.com/gorilla/context"

	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type User struct {
	ID         bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Name       string
	Occupation string
	Phone      string
	Address    string
	Email      string
	Username   string `bson:"username"`
	Password   string
	Pass       []byte `json:"-" bson:"pass"`
	Auth       string
	Image      string
}

type UserRepo struct {
	coll *mgo.Collection
}

func (r *UserRepo) CreateAdmin(member User) error {
	member.Pass, _ = bcrypt.GenerateFromPassword([]byte(member.Password), Cost)
	member.Password = ""
	err := r.coll.Insert(member)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (r *UserRepo) AuthAdmin(temp User) (User, error) {
	var member User
	err := r.coll.Find(bson.M{"username": temp.Username}).One(&member)
	if err != nil {
		log.Println(err)
		return member, err
	}
	err = bcrypt.CompareHashAndPassword(member.Pass, []byte(temp.Password))
	if err != nil {
		member.Auth = "false"
		return member, err
	}
	member.Auth = "true"
	return member, nil

}

func (r *UserRepo) GetAdminUsers() ([]User, error) {
	member := []User{}
	err := r.coll.Find(bson.M{}).All(&member)
	if err != nil {
		log.Println(err)
		return member, err
	}
	return member, nil
}

func (c *Config) CreateAdminHandler(w http.ResponseWriter, r *http.Request) {
	member := User{}
	err := json.NewDecoder(r.Body).Decode(&member)
	if err != nil {
		log.Println(err)
	}
	u := UserRepo{c.MongoSession.DB(c.MONGODB).C("user")}
	u.CreateAdmin(member)
}

func (c *Config) AdminAuthHandler(w http.ResponseWriter, r *http.Request) {
	member := User{}
	err := json.NewDecoder(r.Body).Decode(&member)
	if err != nil {
		log.Println(err)
	}
	u := UserRepo{c.MongoSession.DB(c.MONGODB).C("user")}
	data, _ := u.AuthAdmin(member)
	res, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (c *Config) GetAdminUsersHandler(w http.ResponseWriter, r *http.Request) {
	u := UserRepo{c.MongoSession.DB(c.MONGODB).C("user")}
	data, _ := u.GetAdminUsers()
	res, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}
