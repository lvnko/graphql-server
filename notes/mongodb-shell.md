## MogoDB Shell CRUD 操作
### C : insert
```shell
db.[collection].insertOne()
db.[collection].insertMany()
```
### R : find
```shell
db.[collection].find()
db.[collection].findOne()
```
### U : update
```shell
db.[collection].updateOne()
db.[collection].updateMany()
db.[collection].replaceOne() # replace only one evne many matches
```
### D : delete
```shell
db.[collection].deleteOne()
db.[collection].deleteMany()
db.[collection].remove() # delete single or all
```