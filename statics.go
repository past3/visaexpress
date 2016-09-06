package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

//FrontAdminHandler for serving admin page
func FrontAdminHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "admin/index.html")
}

func LoginAdmin(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "admin/login.html")
}

func LoginClient(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "client/login.html")
}

func ClientHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "client/index.html")
}

func (c *Config) contactUs(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	type MM struct {
		Name    string `json:"name"`
		Email   string `json:"email"`
		Message string `json:"message"`
	}

	msg := MM{}

	//	b := []byte{}
	//	b, err := ioutil.ReadAll(r.Body)
	//	if err != nil {
	//		log.Println(err)
	//	}
	//	log.Println(string(b))

	msg.Name = r.FormValue("name")
	msg.Email = r.FormValue("email")
	msg.Message = r.FormValue("message")
	log.Println(msg)

	/*err := json.NewEncoder(w).Encode(MM{
		Message: "Sent Successfully",
	})
	if err != nil {
		log.Println(err)
	}*/

	message := "Name: " + msg.Name + " \n Email: " + msg.Email + " \n  Message: " + msg.Message

	err := sendMail("New Message from "+msg.Name+" - Visaexpress", message)

	type msgresp struct {
		Title   string `json:"title"`
		Details string `json:"details"`
	}
	data := make(map[string]msgresp)

	if err != nil {
		log.Println(err)
		errorMsg := msgresp{
			Title:   "Message could not be sent",
			Details: "Mailer error",
		}
		data["error"] = errorMsg
		err := json.NewEncoder(w).Encode(data)
		if err != nil {
			log.Println(err)
		}
		return
	}

	successmsg := msgresp{
		Title: "Your account has been created, and is undergoing verification",
	}
	data["success"] = successmsg

	err = json.NewEncoder(w).Encode(data)
	if err != nil {
		log.Println(err)
	}

}
