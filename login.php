<?php 
    include("includes/header.php"); 

    //handle form submit
    if((isset($_POST['submit'])) 
        && (isset($_POST['username']) && $_POST['username'] != '')
        && (isset($_POST['password']) && $_POST['password'] != '')) {
            //store form entries
            $username = $_POST['username'];
            $password = $_POST['password'];
            unset($_POST['username']);
            unset($_POST['password']);
            
            //get database info
            $conn = mysqli_connect("localhost", "root", "", "test");
            $query = 'SELECT * FROM users_info';
            $result = mysqli_query($conn, $query);
            $users = mysqli_fetch_all($result, MYSQLI_ASSOC);
            mysqli_free_result($result);
            mysqli_close($conn);

            //search for match in database
            foreach($users as $user) {
                if($username == $user['username'] && $password == $user['password']) {
                    //match found, login success
                    session_start();
                    $_SESSION['username'] = $user['username'];
                    $_SESSION['points'] = $user['points'];
                    $_SESSION['laps'] = $user['laps'];
                    
                    header("Location: database.php");
                    die();
                }
            }
            echo "Sorry! These login credentials are incorrect";
    }else {
        echo "Please enter a valid username and password";
    }
?>
<h1 class="page-title">Login</h1>
<form method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>">
    <label for="username">Username:</label>
    <input type="text" name="username">
    <?php echo "<br>"?>
    <label for="password">Password:</label>
    <input type="text" name="password">
    <?php echo "<br>"?>
    <input type="submit" name="submit" value="Login">
</form>
<?php include("includes/header.php");?>