<?php
$servername = "";
$username = "";
$password = "";
$dbname = "";
$str = $_POST['str'];
$conn = mysqli_connect($servername, $username, $password, $dbname);
$sql = "UPDATE userData SET userData='$str' WHERE userId=1";
mysqli_query($conn, $sql);
mysqli_close($conn);
?>
