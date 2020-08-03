<?php 

$url = "https://dog.ceo/api/breeds/list/all";

$obj = json_decode(file_get_contents($url), true);

echo "breed" . $obj["message"];

?>