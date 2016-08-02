package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//Message struct to handle message data
type Message struct {
	ID      bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	From    string        `bson:"from"`
	To      string        `bson:"to"`
	Content string        `bson:"content"`
	Title   string        `bson:"title"`
	Name    string        `bson:"name"`
	Fname   string        `bson:"fname"`
	Image   string        `bson:"image"`
}

type Views struct {
	Data []Message
	Pag  Page
}

type MessageRepo struct {
	coll *mgo.Collection
}

func (r *MessageRepo) NewMessage(message Message) error {
	err := r.coll.Insert(message)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (r *MessageRepo) GetInbox(to string, count int, page int, perpage int) (Views, error) {
	data := Views{}
	res := []Message{}
	q := r.coll.Find(bson.M{"$or": []bson.M{bson.M{"to": "broadcast"}, bson.M{"to": to}}})
	n, _ := q.Count()
	Page := SearchPagination(n, page, perpage)
	err := q.Limit(perpage).Skip(Page.Skip).All(&res)
	if err != nil {
		log.Println(err)
		return data, err
	}
	data.Data = res
	data.Pag = Page
	return data, nil

}

func (r *MessageRepo) GetOutbox(from string, count int, page int, perpage int) (Views, error) {
	data := Views{}
	res := []Message{}
	q := r.coll.Find(bson.M{"from": from})
	n, _ := q.Count()
	Page := SearchPagination(n, page, perpage)
	err := q.Limit(perpage).Skip(Page.Skip).All(&res)
	if err != nil {
		log.Println(err)
		return data, err
	}
	data.Data = res
	data.Pag = Page
	return data, nil

}

func (c *Config) GetInboxHandler(w http.ResponseWriter, r *http.Request) {
	u := MessageRepo{c.MongoSession.DB(c.MONGODB).C("message")}
	//id := r.URL.Query().Get("q")
	tmp := r.URL.Query().Get("page")
	to := r.URL.Query().Get("to")
	page, _ := strconv.Atoi(tmp)
	//data, _ := RenderView(id, 50, page, 50)
	data, _ := u.GetInbox(to, 50, page, 50)
	res, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (c *Config) GetOutboxHandler(w http.ResponseWriter, r *http.Request) {
	u := MessageRepo{c.MongoSession.DB(c.MONGODB).C("message")}
	//id := r.URL.Query().Get("q")
	tmp := r.URL.Query().Get("page")
	from := r.URL.Query().Get("from")
	page, _ := strconv.Atoi(tmp)
	//data, _ := RenderView(id, 50, page, 50)
	data, _ := u.GetOutbox(from, 50, page, 50)
	res, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (c *Config) NewMessageHandler(w http.ResponseWriter, r *http.Request) {
	u := MessageRepo{c.MongoSession.DB(c.MONGODB).C("message")}
	//id := r.URL.Query().Get("q")
	message := Message{}
	err := json.NewDecoder(r.Body).Decode(&message)
	if err != nil {
		log.Println(err)
	}
	u.NewMessage(message)

}
