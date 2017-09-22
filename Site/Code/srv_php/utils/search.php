<?php
/**
 * Created by PhpStorm.
 * User: Armin
 * Date: 8/19/2017
 * Time: 5:21 PM
 */
function getFoundProportion($keyword, $haystack){
    if ($keyword == "" || $haystack == ""){
        return 0;
    }
    $keys = explode(" ", $keyword);
    $hays = explode(" ", $haystack);
    $count = 0;
    $flag = FALSE;
    for ($i = 0; $i < count($keys); $i += 1){
        $flag = FALSE;
        for ($j = 0; $j < count($hays); $j += 1){
            if (!$flag && $keys[$i] == $hays[$j]){
                $count += 1;
                $flag = TRUE;
            }
        }
    }
    return $count / (float)count($keys);
}

//echo getFoundProportion("آرمین", "سلام، آرمین من آرمین هستم") . "<br>";
//echo getFoundProportion("آرمین اصغر", "سلام هوی من اصغر") . "<br>";
//echo getFoundProportion("آرمین اصغر", "سلام هوی آرمین من اصغر") . "<br>";
//echo getFoundProportion("آرمین اکبر غلام ایول", "اکبر ایول به غلام") . "<br>";

function check_parameters(){
    echo "<p>keyword:" . $_POST['keyword'] . "</p>";
    if ($_POST['table'] != ""){
        echo "<p>haystack:" . $_POST['table'] . "</p>";
    }
    if ($_POST['column'] != ""){
        echo "<p> columns";
        echo "<ul>";
        for ($i = 0; $i < count($_POST['column']); $i += 1){
            echo "<li>" . $_POST['column'][$i] . "</li>";
        }
        echo "</ul></p>";
    }
    if ($_POST['exact']){
        echo "<p>Exact Query!</p>";
    } else {
        echo "<p>Normal Query!</p>";
    }
    echo "<p>max_size:" . $_POST['max_size'] . "</p>";
}

//check_parameters();

class ProportionId{
    public $prop;
    public $id;
    function __construct($prop, $id){
        $this->prop = $prop;
        $this->id = $id;
    }
}

function insertSearchResult(&$array, $proportion, $id, $max_size){
    $cnt = count($array);
    $flag = FALSE;
    for ($i = 0; $i < $cnt; $i += 1){
        if ($proportion > $array[$i]->prop && !$flag){
            $flag = TRUE;
            array_push($array, clone $array[$cnt - 1]);
            for ($j = $cnt - 1; $j > $i; $j -= 1){
                $array[$j] = clone $array[$j - 1];
            }
            $array[$i] = new ProportionId($proportion, $id);
        }
    }
    if (!$flag){
        array_push($array, new ProportionId($proportion, $id));
    }
    if (count($array) > 10){
        $array = array_slice($array, 0, $max_size);
    }
}

$mysqli = new mysqli('localhost', 'root', '', 'amoozzir_DB');
$mysqli->set_charset("utf8");

if ($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ') '
        . $mysqli->connect_error);
}
$s_res = [];
if ($_POST['table'] == 'course'){
    if (!isset($_POST['column'])){
         $_POST['column'] = ['name'];
    }
    $query = "SELECT id";
    for ($i = 0; $i < count($_POST['column']); $i += 1){
        $query .= ", " . $_POST['column'][$i];
    }
    $query .= " FROM " . $_POST['table'];
//    echo " ::" . $query . ":: ";
    $res = $mysqli->query($query);
    if ($res != NULL && $res != FALSE && $res->num_rows > 0){
        while ($item = $res->fetch_array()){
            $p = -1;
            for ($i = 0; $i < count($_POST['column']); $i += 1){
                $x = $item[$_POST['column'][$i]];
                $p = max($p, getFoundProportion($_POST['keyword'], $x));
            }
            insertSearchResult($s_res, $p, (int)$item['id'], (int)$_POST['max_size']);
        }
        $out = "";
        for ($i = 0; $i < count($s_res); $i += 1){
            $res = $mysqli->query("SELECT name FROM course WHERE id=" . $s_res[$i]->id);
            $course = $res->fetch_array();
            $out .= ";" . $s_res[$i]->prop . ',' . $s_res[$i]->id . ',' . $course['name'];
        }
        echo substr($out, 1);
    } else {
        echo "0";
    }
}



