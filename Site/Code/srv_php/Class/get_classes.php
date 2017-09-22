<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 9/20/17
 * Time: 4:10 PM
 */
$level_map = ["پنجم" => 5, "ششم" => 6, "هفتم" => 7, "هشتم" => 8, "نهم" => 9, "دهم" => 10, "یازدهم" => 11, "پیش دانشگاهی" => 12];
error_reporting(-1);
if (isset($_POST['data0']) && isset($_POST['data1'])){
    include '../common/open_connection.php';
    $sql_i = OpenConnection('localhost', 'root', '', 'amoozzir_DB');
    $data0 = trim($_POST['data0']);
    $data1 = trim($_POST['data1']);
//    echo "<p>data0: " . $data0 . "</p>";
//    echo "<p>data1: " . $data1 . "</p>";
    $property = "";
    switch ($data0){
        case "الم‍پیاد":
            $property = "type";
            $data1 = "'" . $data1 ."'";
            break;
        case "درسی":
            $property = "min_age";
            $data1 = $level_map[$data1];
            break;
        case "کنکور":
            $property = "min_age";
            $data1 = $level_map[$data1];
            break;
        case "مشاوره":
            $data0 = $data0 . "-" . $data1;
            $property = 1;
            $data1 = "'1'";
            break;
        default:
            die("server error");
    }
    $res = $sql_i->query("SELECT id, name FROM course WHERE ctype='" . $data0 . "' AND " . $property . " = " . $data1 . ";");
//    echo ":: " . "SELECT id, name FROM course WHERE ctype='" . $data0 . "' AND " . $property . " = " . $data1 . ";" . " ::";
    $result = array();
    if ($res->num_rows > 0){
        while($data = $res->fetch_array()){
            array_push($result, ['id' => $data['id'], 'name' => $data['name']]);
        }
    }
    echo json_encode($result);
} else {
    die("Server Error!");
}