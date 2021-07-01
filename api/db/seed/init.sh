#!/bin/bash

# Importa tutti i json presenti nella cartella seed/ nelle collection del db

cd seed

dir=$(ls *.json)
for file in $dir; do
	mongo -u $MONGO_DATABASE_USERNAME -p $MONGO_DATABASE_PASSWORD $MONGO_INITDB_DATABASE --eval 'db.'${file%.*}'.drop()'
	mongoimport -u $MONGO_DATABASE_USERNAME -p $MONGO_DATABASE_PASSWORD --collection "${file%.*}" --db $MONGO_INITDB_DATABASE /seed/$file --jsonArray
done
