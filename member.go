package main

import (
	"encoding/json"
	"strconv"

	//	"github.com/gorilla/context"

	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Member struct {
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

type NewView struct {
	Data []Member
	Pag  Page
}

type MemberRepo struct {
	coll *mgo.Collection
}

func (r *MemberRepo) Create(member Member) error {
	member.Pass, _ = bcrypt.GenerateFromPassword([]byte(member.Password), Cost)
	member.Password = ""
	err := r.coll.Insert(member)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (r *MemberRepo) Auth(temp Member) (Member, error) {
	var member Member
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

func (r *MemberRepo) GetUsers(count int, page int, perpage int) (NewView, error) {
	member := []Member{}
	newV := NewView{}
	q := r.coll.Find(bson.M{})
	n, _ := q.Count()
	Page := SearchPagination(n, page, perpage)
	err := q.Limit(perpage).Skip(Page.Skip).All(&member)
	if err != nil {
		log.Println(err)
		return newV, err
	}
	newV.Data = member
	newV.Pag = Page
	return newV, nil
}

func (c *Config) CreateHandler(w http.ResponseWriter, r *http.Request) {
	member := Member{}
	err := json.NewDecoder(r.Body).Decode(&member)
	if err != nil {
		log.Println(err)
	}
	u := MemberRepo{c.MongoSession.DB(c.MONGODB).C("member")}
	u.Create(member)
}

func (c *Config) AuthHandler(w http.ResponseWriter, r *http.Request) {
	member := Member{}
	err := json.NewDecoder(r.Body).Decode(&member)
	if err != nil {
		log.Println(err)
	}
	u := MemberRepo{c.MongoSession.DB(c.MONGODB).C("member")}
	data, _ := u.Auth(member)
	res, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (c *Config) GetUsersHandler(w http.ResponseWriter, r *http.Request) {
	u := MemberRepo{c.MongoSession.DB(c.MONGODB).C("member")}
	//id := r.URL.Query().Get("q")
	tmp := r.URL.Query().Get("page")
	page, _ := strconv.Atoi(tmp)
	//data, _ := RenderView(id, 50, page, 50)
	data, _ := u.GetUsers(50, page, 50)
	res, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}
