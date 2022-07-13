const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const ObjectId = mongoose.ObjectId;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

// Requests targeting all articles

app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("Added article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.findById("62ce2bd4a88e19b7b74e031b", (err, doc) => {
      if (!err) {
        doc.delete((err) => {
          if (!err) {
            res.redirect("/articles");
          } else {
            res.send(err);
            console.error(err);
          }
        });
      } else {
        res.send(err);
      }
    });
  });

// Requests targeting specific articles

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send("No articles found with that title");
      }
    });
  })
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Article updated");
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Article updated");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err, docs) => {
      if (!err) {
        res.send("Article deleted.");
      } else {
        res.send(err);
      }
    });
  });

// app.get("/articles", (req, res) => {
//   Article.find((err, foundArticle) => {
//     if (!err) {
//       res.send(foundArticle);
//     } else {
//       res.send(err);
//     }
//   });
// });

// app.post("/articles", (req, res) => {
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content,
//   });

//   newArticle.save((err) => {
//     if (!err) {
//       res.send("Added article");
//     } else {
//       res.send(err);
//     }
//   });
// });

// app.delete("/articles", (req, res) => {
//   //   Article.findByIdAndDelete();
//   Article.findById("62ce2534337d298848c48b65", (err, doc) => {
//     if (!err) {
//       doc.delete((err) => {
//         if (!err) {
//           res.redirect("/articles");
//         } else {
//           res.send(err);
//           console.error(err);
//         }
//       });
//     } else {
//       res.send(err);
//     }
//   });
// });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
