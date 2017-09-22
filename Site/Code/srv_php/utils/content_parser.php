<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 9/22/17
 * Time: 3:32 PM
 */
$result = [];
$result['OK'] = FALSE;
$result['content'] = '';
function parseFile($fileAddress){
    $contents = file_get_contents($fileAddress);
    $items = explode('$item', $contents);
    for ($i = 0; $i < count($items); $i += 1){
        $item = trim($items);
        if ($item[0] == '{' && $item[strlen($item) - 1] == '}'){
            $item = trim(substr($item, 1, strlen($item) - 2));
        } else {
            $result['content'] = 'expected { or }';
            return $result;
        }
    }
}