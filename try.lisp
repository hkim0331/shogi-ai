(defvar *aoi* "{\"name\": \"aoi\", \"year\":17}")
(with-input-from-string
    (s "nil")
  (json:decode-json *aoi*))

(format nil "~a" (json:decode-json-from-string *aoi*)) 
