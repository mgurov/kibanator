package main

import (
	"log"
	"net/http"
	"encoding/json"
	"fmt"
)

func main() {

	http.HandleFunc("/api/next", nextHandler)

	fs := http.FileServer(http.Dir("assets"))
	http.Handle("/", fs)

	log.Println("Listening...")
	http.ListenAndServe(":3000", nil)
}

func nextHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var data map[string]interface{}
	err := decoder.Decode(&data)
	if (err != nil) {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Println(err)
	} else {
		fmt.Printf("%#v\n", data);
	}
}