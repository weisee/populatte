# **Populatte.js** #

**Populatte** allow you to populate object or array of objects with fields from different origins (MongoDB, PostgreSQL, any api, etc.).

### Example ###

Create **Populatte** instance
```
#!javascript

var populatte = new Populatte({}, {mongodb: 'mongodb://localhost:27017/populatte'})
```

make description for the object fields that we want to **populatte**
```
#!javascript
var objectRefs = {
    'user': {collection: 'users'},
    'user.friends': {collection: 'users'},
}
```
and **populatte** all you want!
```
#!javascript
var object = {
    user: ObjectId('57791c54de84b5677159e4c2')
}
populatte.populate(objectRefs, object, 'user.friends user')
```