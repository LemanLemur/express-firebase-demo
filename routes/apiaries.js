var express = require('express');
var router = express.Router();

/* GET apiaries listing. */
router.get('/', function(req, res, next) {
    const db = req.app.get("db");
    var output = [];
  
    db.collection("apiary")
      .get()
      .then(snapshot => {
        if (snapshot) {
          snapshot.forEach(doc => {
            output.push({
              id: doc.id,
              location: doc.data().location
            });
          });
          return res.status(200).json(output);
        } else {
          return res.status(404).json({ message: "Any apiary not found." });
        }
      })
      .catch(error => {
        return res
          .status(400)
          .json({ message: "Unable to connect to Firestore." });
      });
});

router.get('/:apiaries_id', function(req, res, next) {
    const db = req.app.get("db");
    var output = [];
  
    db.collection("apiary")
      .get()
      .then(snapshot => {
        if (snapshot.user_id == req.param.apiaries_id) {
          snapshot.forEach(doc => {
            output.push({
              id: doc.id,
              location: doc.data().location
            });
          });
          return res.status(200).json(output);
        } else {
          return res.status(404).json({ message: "Any apiary not found." });
        }
      })
      .catch(error => {
        return res
          .status(400)
          .json({ message: "Unable to connect to Firestore." });
      });
});

/* POST apiaries listing. */

router.post("/", (req, res) => {
  const db = req.app.get("db");

  var tmp_user_id = req.body.user_id;
  var tmp_location = req.body.location;

  db.collection("apiary")
    .add({
      user_id: tmp_user_id,
      location: tmp_location
    })
    .then(ref => {
      if (ref.id) {
        return res.status(200).json({ apiary_id: ref.id });
      } else {
        return res.status(400).json({ message: "Something went wrong." });
      }
    })
    .catch(error => {
      return res
        .status(400)
        .json({ message: "Unable to connect to Firestore." });
    });
});

/* PUT apiaries listing. */

router.put("/:apiary_id", (req, res) => {
  const db = req.app.get("db");

  let tmp_location = req.body.location;
  var update = {};

  if (tmp_location) update["location"] = tmp_location;

  if (!update) {
    return res.status(304).json({ message: "No changes." });
  } else {
    db.collection("apiary")
      .doc(req.params.apiary_id)
      .set(update, { merge: true })
      .then(() => {
        return res.status(200).json({ message: "Apiary updated." });
      })
      .catch(error => {
        return res
          .status(400)
          .json({ message: "Unable to connect to Firestore." });
      });
  }
});

/* DELETE apiaries listing. */

router.delete("/:apiary_id", (req, res) => {
  const db = req.app.get("db");

  db.collection("apiary")
    .doc(req.params.apiary_id)
    .delete()
    .then(() => {
      return res.status(200).json({ message: "Apiary deleted." });
    })
    .catch(error => {
      return res
        .status(400)
        .json({ message: "Unable to connect to Firestore." });
    });
});


module.exports = router;
