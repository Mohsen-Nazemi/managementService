var schema = {
  // a schema according to json-schema standard
  "type": "object", // ورودی (values) یک آبجکت است.
  "properties": { // معرفی کلیدهای داخل values
    "variableName1": {
      "keyword1": [param1, ...], // معرفی اعتبارسنج و پارامترهای آن
      "errorMessages": {
        "keyword1": "پیام خطای دلخواه",
        "param1": "پیام خطای دلخواه مرتبط با پارامتر اول",
        ...
      }
    },
    "variableName2": {
      "keyword2": [param1, ...], // معرفی اعتبارسنج و پارامترهای آن
      "errorMessages": {
        "keyword2": "پیام خطای دلخواه",
        "param1": "پیام خطای دلخواه مرتبط با پارامتر اول",
        ...
      }
    }
  },
  "required": [
    "variableName1",
    "variableName2"
  ],
  "additionalProperties": false // یعنی در داده های ورودی، وجود هر کلیدی غیر از کلیدهایی که در شِما معرفی شده اند، غیر مجاز است
};

// either:
var pjv = new (require('partJsonValidator'))(schema);
pjv.validate(request.data);
// or:
var pjv = new (require('partJsonValidator'))();
pjv.validate(request.data, schema);

pjv.errorMessages(); // returns null or an array of error messages.