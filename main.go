package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/context"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
	"github.com/rs/cors"
)

// Router struct would carry the httprouter instance, so its methods could be verwritten and replaced with methds with wraphandler
type Router struct {
	*httprouter.Router
}

// Get is an endpoint to only accept requests of method GET
func (r *Router) Get(path string, handler http.Handler) {
	r.GET(path, wrapHandler(handler))
}

// Post is an endpoint to only accept requests of method POST
func (r *Router) Post(path string, handler http.Handler) {
	r.POST(path, wrapHandler(handler))
}

// Put is an endpoint to only accept requests of method PUT
func (r *Router) Put(path string, handler http.Handler) {
	r.PUT(path, wrapHandler(handler))
}

// Delete is an endpoint to only accept requests of method DELETE
func (r *Router) Delete(path string, handler http.Handler) {
	r.DELETE(path, wrapHandler(handler))
}

// NewRouter is a wrapper that makes the httprouter struct a child of the router struct
func NewRouter() *Router {
	return &Router{httprouter.New()}
}

func wrapHandler(h http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		context.Set(r, "params", ps)
		h.ServeHTTP(w, r)
	}
}

//Conf nbfmjh
type Conf struct {
	xx string
	xy string
}

var (
	config Conf

	//IMAGE_DIR = "./"
)

func init() {

	MONGOSERVER := os.Getenv("MONGOLAB_URI")
	MONGODB := os.Getenv("MONGODB")
	if MONGOSERVER == "" {
		log.Println("No mongo server address set, resulting to default address")
		MONGOSERVER = "mongodb://localhost"
		MONGODB = "visaexpress"
		//mongodb://localhost
	}
	config = Conf{
		xy: MONGODB,
		xx: MONGOSERVER,
	}

	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {
	commonHandlers := alice.New(context.ClearHandler, loggingHandler, recoverHandler)
	router := NewRouter()
	router.ServeFiles("/assets/*filepath", http.Dir("assets"))
	//router.ServeFiles("/admin/*filepath", http.Dir("admin"))
	router.Get("/admin", commonHandlers.ThenFunc(FrontAdminHandler))
	router.Get("/login", commonHandlers.ThenFunc(LoginAdmin))
	log.Println(config.xx)
	PORT := os.Getenv("PORT")
	if PORT == "" {
		log.Println("No Global port has been defined, using default")

		PORT = "8181"

	}

	handler := cors.New(cors.Options{
		//		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedOrigins: []string{"*"},

		AllowedMethods:   []string{"GET", "POST", "DELETE"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"Accept", "Content-Type", "X-Auth-Token", "*"},
		Debug:            false,
	}).Handler(router)
	log.Println("serving ")
	log.Fatal(http.ListenAndServe(":"+PORT, handler))
}
