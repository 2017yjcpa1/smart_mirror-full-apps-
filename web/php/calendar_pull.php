<?php 
   
    $path='C:\xampp\htdocs\smart_mirror\calendar';
    $file = file_get_contents($path.'/schedule.json');

    echo $file;
   
?>