(defvar *aoi* "{\"name\": \"aoi\", \"year\":17}")
(with-input-from-string
    (s nil)
  (json:decode-json s))

(json:decode-json-from-string *aoi*)
