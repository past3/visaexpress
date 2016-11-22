package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/context"
	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

const (
	//Cost is the, well, cost of the bcrypt encryption used for storing user
	//passwords in the database. It determines the amount of processing power to
	// be used while hashing and saalting the password. The higher, the cost,
	//the more secure the password hash, and also the more cpu cycles used for
	//password related processes like comparing hasshes during authentication
	//or even hashing a new password.
	Cost int = 5
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

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {
	config := generateConfig()
	defer config.MongoSession.Close()
	commonHandlers := alice.New(context.ClearHandler, loggingHandler, recoverHandler)
	log.Println("starting")
	router := NewRouter()
	router.ServeFiles("/assets/*filepath", http.Dir("assets"))
	router.ServeFiles("/admin/*filepath", http.Dir("admin"))
	router.ServeFiles("/client/*filepath", http.Dir("client"))
	//Admin routes
	router.Get("/admin", commonHandlers.ThenFunc(FrontAdminHandler))
	router.Get("/login", commonHandlers.ThenFunc(LoginAdmin))
	router.Get("/getAdminUsers", commonHandlers.ThenFunc(config.GetAdminUsersHandler))

	router.Post("/newAdmin", commonHandlers.ThenFunc(config.CreateAdminHandler))

	router.Post("/authAdmin", commonHandlers.ThenFunc(config.AdminAuthHandler))
	router.Post("/upload", commonHandlers.ThenFunc(config.UploadHandler))
	router.Get("/getLetters", commonHandlers.ThenFunc(config.GetLetterHandler))
	router.Get("/gallery", commonHandlers.ThenFunc(config.GetGalleryHandler))
	router.Post("/gallery", commonHandlers.ThenFunc(config.UploadGalleryHandler))
	router.Get("/package", commonHandlers.ThenFunc(config.GetPackagesHandler))
	router.Post("/package", commonHandlers.ThenFunc(config.SubmitPackageHandler))
	//client Routes
	router.Get("/memberlogin", commonHandlers.ThenFunc(LoginClient))
	router.Get("/member", commonHandlers.ThenFunc(ClientHandler))
	//User Routes
	router.Get("/getUsers", commonHandlers.ThenFunc(config.GetUsersHandler))
	router.Post("/newuser", commonHandlers.ThenFunc(config.CreateHandler))
	router.Post("/auth", commonHandlers.ThenFunc(config.AuthHandler))
	router.Post("/NewMessage", commonHandlers.ThenFunc(config.NewMessageHandler))
	router.Get("/inbox", commonHandlers.ThenFunc(config.GetInboxHandler))
	router.Get("/outbox", commonHandlers.ThenFunc(config.GetOutboxHandler))

	router.Handle("POST", "/contact.html", config.contactUs)

	router.HandlerFunc("GET", "/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./frontend/favicon.ico")
	})
	router.HandlerFunc("GET", "/contact.html", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./frontend/contact.html")
	})
	router.HandlerFunc("GET", "/gallery.html", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./frontend/gallery.html")
	})
	router.HandlerFunc("GET", "/packages.html", config.GetPackagesHandler)

	router.HandlerFunc("GET", "/index.html", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./frontend/index.html")
	})
	router.HandlerFunc("GET", "/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./frontend/index.html")
	})

	router.HandlerFunc("GET", "/zohoverify/verifyforzoho.html", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./frontend/verifyforzoho.html")
	})
	router.NotFound = http.FileServer(http.Dir("./assets/"))

	PORT := os.Getenv("PORT")
	if PORT == "" {
		log.Println("No Global port has been defined, using default")

		PORT = "8181"

	}

	/*	handler := cors.New(cors.Options{
		//		AllowedOrigins:   []string{"http://localhost:3000"},

		AllowedMethods:   []string{"GET", "POST", "DELETE"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler(router)*/
	log.Println("serving ")
	log.Fatal(http.ListenAndServe(":"+PORT, router))
}
