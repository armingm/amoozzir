<?php
/**
 * Created by PhpStorm.
 * User: Armin
 * Date: 8/24/2017
 * Time: 2:55 PM
 */

function OpenConnection($host, $username, $password, $database){
    $mysqli = new mysqli($host, $username, $password, $database);
    $mysqli->set_charset("utf8");

    if ($mysqli->connect_error) {
        die('Connect Error (' . $mysqli->connect_errno . ') '
            . $mysqli->connect_error);
    }
    return $mysqli;
}