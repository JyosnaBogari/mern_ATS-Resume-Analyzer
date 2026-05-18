import exp from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const router = exp.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),

  (req, res) => {
    try {
      // Create JWT token after successful Google authentication
      const token = jwt.sign(
        {
          userId: req.user._id,
          email: req.user.email,
          id: req.user._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "7d",
        }
      );

      // Store token in httpOnly cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Redirect to dashboard
      res.redirect("http://localhost:5173/dashboard");
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.redirect("http://localhost:5173/signin?error=auth_failed");
    }
  }
);

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("connect.sid"); // Clear session cookie
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;