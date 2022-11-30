const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const path = url.parse(req.url, true).pathname;
  if (path == "/headers") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify(req.headers));
  } else if (path == "/plural") {
    const queryObject = url.parse(req.url, true).query;
    let num = queryObject.number;
    let words = queryObject.forms.split(",");

    function plural(count, one, few, many) {
      let form = "";
      let validateNumber = 0;
      if (count > 100) {
        validateNumber = count.toString().slice(-2);
        if (validateNumber % 10 == 1) {
          form = one;
        } else if (validateNumber % 10 > 1 && validateNumber % 10 < 5) {
          form = few;
        } else {
          form = many;
        }
      } else if (count == 1 || (count % 10 == 1 && count != 11)) {
        form = one;
      } else if (
        (count > 1 && count < 5) ||
        (count % 10 > 1 && count % 10 < 5)
      ) {
        form = few;
      } else {
        form = many;
      }
      return count + " " + form;
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(plural(num, words[0], words[1], words[2]));
  } else if (path == "/frequency") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      let uniqueWords = Object.keys(frequency(data)).length;

      function frequency(string) {
        let words = {};
        let charOfString = string.split(/[ ,]+/);

        for (const word of charOfString) {
          if (words[word]) {
            words[word] += 1;
          } else {
            words[word] = 1;
          }
        }
        return words;
      }

      let value = Object.values(frequency(data));
      let max = Math.max(...value);
      let keys = Object.keys(frequency(data)).filter(
        (k) => frequency(data)[k] == max
      );

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Count-Unique-Words": uniqueWords,
        "the-Most-Common-Word": keys,
      });

      res.end(JSON.stringify(frequency(data)));
    });
  }
});
const port = 5000;
server.listen(port, () => {
  console.log("Server started at localhost", port);
});
