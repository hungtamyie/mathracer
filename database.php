<?php 
    include("includes/header.php"); 
    session_start();
    //check login
    if(empty($_SESSION['username']) || $_SESSION['username'] == '') {
        header("Location: login.php");
        die();
    }
?>

<h1 class="page-title">Database Log with PHP</h1>
<?php 
    $conn = mysqli_connect("localhost", "root", "", "test");
    //hostname, username, password, database name
    if(mysqli_connect_errno()) {
        echo "error with connection";
    }else {
        //*** HOW TO ACCESS DATA IN DB ***/
        //1. create SQL query
        $query = 'SELECT * FROM users_info';

        //2. get result
        $queryResult = mysqli_query($conn, $query);

        //3. fetch data (returns array)
        $users = mysqli_fetch_all($queryResult, MYSQLI_ASSOC);

        //4. free result from memory to improve performance
        mysqli_free_result($queryResult);

        //5. close connection
        mysqli_close($conn);
    }
?>
<ul>
    <?php
        foreach($users as $user) {
            echo "<li>" . "Username: " . $user['username'] . 
                " Password: " . $user['password'] .
                " ID: " . $user['id'] . " Points: " . $user['points'] . 
                " Laps: " . $user['laps'] . "</li><br>";
        }
    ?>
</ul>