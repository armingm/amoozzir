<?php
/**
 * Created by PhpStorm.
 * User: Armin
 * Date: 8/23/2017
 * Time: 8:51 PM
 */
include '../common/open_connection.php';
if (isset($_POST['filters'])){
    $mysqli = OpenConnection('localhost', 'root', '', 'amoozzir_DB');
    $field = isset($_POST['filters']['field']) ? $_POST['filters']['field'] : "";
    $course = $_POST['filters']['course'];
    $type = isset($_POST['filters']['type']) ? $_POST['filters']['type'] : "";
    $query = "SELECT DISTINCT course_instructor.instructor AS name, instructor.resume AS resume, instructor.lng AS lng, instructor.department AS department FROM (instructor JOIN course_instructor ON instructor.name = course_instructor.instructor) JOIN course ON course.id = course_instructor.course WHERE 1 = 1";
    $tmp = "";
    if ($field != ""){
        $tmp .= " AND (";
        for ($i = 0; $i < count($field); $i += 1){
            $tmp .= "instructor.department = '" . $field[$i] . "'";
            if ($i != count($field) - 1) {
                $tmp .= " OR ";
            }
        }
        $tmp .= ")";
    }
    $field = $tmp;
    $course = ($course == -1 ? "" : " AND course.id = " . $course);
    $tmp = "";
    if ($type != "") {
        $tmp .= " AND (";
        for ($i = 0; $i < count($type); $i += 1) {
            $tmp .= "course.ctype = '" . $type[$i] . "'";
            if ($i != count($type) - 1) {
                $tmp .= " OR ";
            }
        }
        $tmp .= ")";
        $type = $tmp;
    }
//    $type = ($type == "" ? "" : " AND course.ctype = " . $type . "'");
    $res = $mysqli->query($query . $field . $course . $type . " ORDER BY instructor.department");
//    echo $query . $field . $course . $type . "<br>";
    $out = '';
    while ($instructor = $res->fetch_array()){
        $out .= '&#' . $instructor['name'] . ',' . '$$' . $instructor['resume'] . '$$' . $instructor['lng'] . ',' . $instructor['department'];
    }
//    header('HTTP', true, 200);
    echo substr($out, 2);
} else {
    header('HTTP', true, 500);
    echo "مشکل در اتصال به سرور :(";
}