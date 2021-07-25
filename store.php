<?php 
    include("includes/header.php"); 
    session_start();
    //check login
    if(empty($_SESSION['username']) || $_SESSION['username'] == '') {
        header("Location: login.php");
        die();
    }

    //handle form submit
    if(isset($_POST['free-money'])) {
        $username = $_SESSION['username'];
        $points = $_SESSION['points'] + 1;

        //*** HOW TO UPDATE DATA IN DB ***/
        $conn = mysqli_connect("localhost", "root", "", "test");
        $query = "UPDATE users_info SET points='$points' WHERE username='$username'";
        if(mysqli_query($conn, $query)) {
            //success
            $_SESSION['points']++;
        }else {
            echo "Sorry! There was a problem connecting to the database. Please try again";
            header("Location: store.php");
        }
        mysqli_close($conn);
    }
?>
<h1 class="page-title">Store</h1>
<h2>Welcome <?php echo $_SESSION['username']; ?>! You currently have 
<?php echo $_SESSION['points']; ?> points to spend.</h2>

<form method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>">
<input type="submit" name="free-money" value="Press for 1 free point">
</form>
<script></script>