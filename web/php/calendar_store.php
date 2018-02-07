<?php
	$data = $_POST['message'];
        $fname='../../calendar/schedule.json';
        
        file_put_contents($fname, $data); // 저장 ! 

?>

