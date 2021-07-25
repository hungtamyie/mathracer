<?php 
    include("includes/header.php"); 
    session_start();
    //check login
    if(empty($_SESSION['username']) || $_SESSION['username'] == '') {
        header("Location: login.php");
        die();
    }

    //handle form submit
    if(isset($_POST['submit']) 
    && (isset($_POST['username']) && $_POST['username'] != '')
    && (isset($_POST['password']) && $_POST['password'] != '')) {
        //store form entries
        $username = $_POST['username'];
        $password = $_POST['password'];
        $_POST['username'] = '';
        $_POST['password'] = '';
        
        //get database info
        $conn = mysqli_connect("localhost", "root", "", "test");
        $query = 'SELECT * FROM users_info';
        $result = mysqli_query($conn, $query);
        $users = mysqli_fetch_all($result, MYSQLI_ASSOC);
        mysqli_free_result($result);
        

        //search for match in database
        $isTaken = false;
        foreach($users as $user) {
            if($username == $user['username']) { //user already exists
                echo "Sorry! That username is already taken!";
                $isTaken = true;
                
            }
        }
        if($isTaken) {
            mysqli_close($conn);
        }else {
            //*** HOW TO INSERT DATA INTO DB ***//
            //add user to users_info database
            //1.create query
            $query = "INSERT INTO users_info (username, password) VALUES ('$username', '$password')";
            //2. store data
            if(mysqli_query($conn, $query)) {
                //success
                header("Location: database.php");
            }else {
                echo "Sorry! There was a problem connecting to the database. Please try again";
                header("Location: create_user.php");
            }
            mysqli_close($conn); 
        }     
}else {
    echo "Please enter a valid username and password";
}
?>

<h1 class="page-title">Create User</h1>
<form method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>">
    <label for="username">Username:</label>
    <input type="text" name="username">
    <?php echo "<br>";?>
    <label for="password">Password:</label>
    <input type="text" name="password">
    <?php echo "<br>";?>
    <input type="submit" name="submit" value="Create User">
</form>