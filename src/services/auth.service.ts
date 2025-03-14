import User, { type IUser } from "../models/user.model";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/api-errors";

// Define a user type without password for safe return values
type SanitizedUser = Omit<IUser, "password">;

export default class AuthService {
  /**
   * Register a new user
   */
  public static async register(
    userData: Partial<IUser>
  ): Promise<{ user: SanitizedUser; token: string }> {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new BadRequestError("Email already in use");
      }

      const user = await User.create(userData);
      const token = user.generateAuthToken();

      // Safely remove password with type assertion
      const { password, ...userWithoutPassword } = user.toObject();
      return { 
        user: userWithoutPassword as SanitizedUser, 
        token 
      };
    } catch (error: unknown) {
      if (error instanceof BadRequestError) throw error;
      const message = error instanceof Error ? error.message : "Registration failed";
      throw new BadRequestError(`Error registering user: ${message}`);
    }
  }

  /**
   * Login user
   */
  public static async login(
    email: string,
    inputPassword: string // Renamed parameter to avoid conflict
  ): Promise<{ user: SanitizedUser; token: string }> {
    if (!inputPassword) {
      throw new BadRequestError("Password is required");
    }

    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await user.comparePassword(inputPassword))) {
        throw new UnauthorizedError("Invalid credentials");
      }

      if (!user.isActive) {
        throw new UnauthorizedError("Account deactivated");
      }

      const token = user.generateAuthToken();
      const { password, ...userWithoutPassword } = user.toObject();
      
      return {
        user: userWithoutPassword as SanitizedUser,
        token,
      };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedError) throw error;
      const message = error instanceof Error ? error.message : "Login failed";
      throw new BadRequestError(`Error logging in: ${message}`);
    }
  }

  /**
   * Get current user
   */
  public static async getCurrentUser(userId: string): Promise<SanitizedUser> {
    try {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError("User not found");

      // Remove password from response
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword as SanitizedUser;
    } catch (error: unknown) {
      if (error instanceof NotFoundError) throw error;
      const message = error instanceof Error ? error.message : "User fetch failed";
      throw new BadRequestError(`Error getting current user: ${message}`);
    }
  }
}