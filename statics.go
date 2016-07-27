package main

import (
	"net/http"
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
