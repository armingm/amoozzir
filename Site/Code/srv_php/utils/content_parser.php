<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 9/22/17
 * Time: 3:32 PM
 */
//function getItemPart($itempart){
//    $colon_pos = strpos($itempart, ':');
//    $data['name'] = substr($itempart, 0, $colon_pos);
//    $data['value']
//}
//function parseFile($fileAddress){
//    $contents = file_get_contents($fileAddress);
//    $items = explode('$item', $contents);
//    for ($i = 0; $i < count($items); $i += 1){
//        $item = trim($items);
//        if ($item[0] == '{' && $item[strlen($item) - 1] == '}'){
//            $item = trim(substr($item, 1, strlen($item) - 2));
//            $item_parts = explode(';', $item);
//            for ($j = 0; $j < count($item_parts); $i += 1){
//                getItemPart($item_parts[$j]);
//            }
//        } else {
//            $result['content'] = 'expected { or }';
//            return $result;
//        }
//    }
//}

function loadFile($fileAddress){
    if (!file_exists($fileAddress)){
        file_put_contents($fileAddress, "[]");
    }
    $contents = file_get_contents($fileAddress);
    return json_decode($contents);
}

function getContent($fileAddress){
    $result = [];
    $result['OK'] = TRUE;
    $result['content'] = [];
    $contents = loadFile($fileAddress);
    for ($i = 0; $i < count($contents); $i += 1){
        if (isset($contents[$i]['title']) && isset($contents[$i]['body'])){
            array_push($result['content'], $contents[$i]);
        } else {
            $result['OK'] = FALSE;
        }
    }
    return $result;
}
