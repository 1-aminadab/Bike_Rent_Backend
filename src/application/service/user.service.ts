import { UserRole } from '../../domain/enums/user.enum';
import { IUser } from '../../domain/interface/user.interface';
import UserModel  from '../../infrastructure/models/user.model';
import { logger } from '../../logger';
import moment from "moment";

class UserService {
  async getCustomerStats() {
    const today = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    
    // Filter users by registration date
    const totalUsers = await UserModel.countDocuments({ role: UserRole.User});

    const todayUsers = await UserModel.countDocuments({
      createdAt: { $gte: new Date(today.setHours(0, 0, 0, 0)) }
    });

    const weekUsers = await UserModel.countDocuments({
      createdAt: { $gte: new Date(today.getTime() - 7 * oneDay) }
    });

    const monthUsers = await UserModel.countDocuments({
      createdAt: { $gte: new Date(today.setDate(1)) }
    });

    const lastThreeYearsUsers = await UserModel.aggregate([
      {
        $group: {
          _id: { $year: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 3 }
    ]);

    return {
      totalUsers,
      todayUsers,
      weekUsers,
      monthUsers,
      lastThreeYearsUsers,
    };
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await UserModel.findById(userId).exec();
    } catch (error) {
      logger.error('Error fetching user by ID', { error });
      throw new Error('Error fetching user by ID');
    }
  }

  async updateUser(userId: string, user: Partial<IUser>): Promise<IUser | null> {
    console.log(user, 'updated info ..................');
  
    try {
      // Cast the status to boolean if it exists
      if (user.status) {  
        user.status = user.status === 'active';
      }
  
      return await UserModel.findByIdAndUpdate(userId, user, { new: true }).exec();
    } catch (error) {
      logger.error('Error updating user', { error });
      throw new Error('Error updating user');
    }
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    try {
    return await UserModel.findOneAndDelete({ _id: userId, role: UserRole.User }).exec();
      // return await UserModel.findByIdAndDelete(userId).exec();
    } catch (error) {
      logger.error('Error deleting user', { error });
      throw new Error('Error deleting user');
    }
  }

async getAllUsers(): Promise<IUser[]> {
    try {
      return await UserModel.find({ role: UserRole.User}).exec();
    } catch (error) {
      logger.error('Error fetching all users', { error });
      throw new Error('Error fetching all users');
    }
  }
//  ________________________ sub admins ___________________________________________
  async getSubAdmins(): Promise<IUser[]> {
    try {
      return await UserModel.find({ role: UserRole.SubAdmin })
      .select('-password -refreshToken')  // Exclude password and refreshToken
      .exec();
    } catch (error) {
      logger.error('Error fetching sub-admins', { error });
      throw new Error('Error fetching sub-admins');
    }
  }

//  ________________________ admins ___________________________________________

  async getAdmins(): Promise<IUser[]> {
    try {
      return await UserModel.find({ role: UserRole.Admin }).exec();
    } catch (error) {
      logger.error('Error fetching admins', { error });
      throw new Error('Error fetching admins');
    }
  }
// Update SubAdmin
async updateSubAdmin(userId: string, user: Partial<IUser>): Promise<IUser | null> {
  try {
    console.log('new data ..............');
    
    // Handle status conversion if necessary
    if (user.status) {
      user.status = user.status === 'active';
    }

    return await UserModel.findOneAndUpdate({ _id: userId, role: UserRole.SubAdmin }, user, { new: true }).exec();
  } catch (error) {
    logger.error('Error updating sub-admin', { error });
    throw new Error('Error updating sub-admin');
  }
}

// Update Admin
async updateAdmin(userId: string, user: Partial<IUser>): Promise<IUser | null> {
  try {
    // Handle status conversion if necessary
    if (user.status) {
      user.status = user.status === 'active';
    }

    return await UserModel.findOneAndUpdate({ _id: userId, role: UserRole.Admin }, user, { new: true }).exec();
  } catch (error) {
    logger.error('Error updating admin', { error });
    throw new Error('Error updating admin');
  }
}

// Delete SubAdmin
async deleteSubAdmin(userId: string): Promise<IUser | null> {
  try {
    return await UserModel.findOneAndDelete({ _id: userId, role: UserRole.SubAdmin }).exec();
  } catch (error) {
    logger.error('Error deleting sub-admin', { error });
    throw new Error('Error deleting sub-admin');
  }
}

// Delete Admin
async deleteAdmin(userId: string): Promise<IUser | null> {
  try {
    return await UserModel.findOneAndDelete({ _id: userId, role: UserRole.Admin }).exec();
  } catch (error) {
    logger.error('Error deleting admin', { error });
    throw new Error('Error deleting admin');
  }
}

async  getCustomersByTimeFrame(timeFrame: string): Promise<any | null> {
  try {
    // let startDate, endDate, groupBy, dateFormat, duration;
    let startDate:any, endDate:any, groupBy:any, dateFormat:any, duration:any, unit:any;

    const now = moment();

    // Define time frame logic
    switch (timeFrame) {
      case "today":
        startDate = now.clone().startOf("day");
        endDate = now.clone().endOf("day");
        groupBy = { hour: { $hour: "$createdAt" } };
        dateFormat = "HH"; // Group by hour
        duration = 24;
        break;
      case "this week":
        startDate = now.clone().startOf("isoWeek");
        endDate = now.clone().endOf("isoWeek");
        groupBy = { day: { $dayOfWeek: "$createdAt" } };
        dateFormat = "dddd"; // Group by day
        duration = 7;
        break;
      case "this month":
        startDate = now.clone().startOf("month");
        endDate = now.clone().endOf("month");
        groupBy = { week: { $week: "$createdAt" } };
        dateFormat = "Week"; // Group by week
        duration = 4; // Approximate number of weeks
        break;
      case "this year":
        startDate = now.clone().startOf("year");
        endDate = now.clone().endOf("year");
        groupBy = { month: { $month: "$createdAt" } };
        dateFormat = "MMM"; // Group by month
        duration = 12;
        break;
      default:
        throw new Error("Invalid time frame");
    }

    const customerData = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        },
      },
      {
        $group: {
          _id: groupBy,
          verifiedCustomers: {
            $sum: { $cond: [{ $eq: ["$verified", true] }, 1, 0] },
          },
          unverifiedCustomers: {
            $sum: { $cond: [{ $eq: ["$verified", false] }, 1, 0] },
          },
          totalCustomers: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Fill in any missing time slots (optional, for smooth graphs)
    const categories = [];
    const verifiedData = [];
    const unverifiedData = [];
    const totalData = [];

    for (let i = 0; i < duration; i++) {
      const key = startDate.clone().add(i, timeFrame === "today" ? "hours" : "days").format(dateFormat);
      // const key = startDate.clone().add(i, unit).format(dateFormat); // Use the correct format and time unit

      // const transaction = customerData.find((t) => t._id === i + 1); // Adjust indexing based on groupBy

      const transaction = customerData.find((t) => {
        if (timeFrame === "today") return t._id.hour === i; // Match hours for 'today'
        if (timeFrame === "this week") return t._id.day === i + 1; // Match days of the week
        if (timeFrame === "this month") return t._id.week === startDate.clone().add(i, 'weeks').week(); // Match weeks of the month
        if (timeFrame === "this year") return t._id.month === i + 1; // Match months of the year
      });
      categories.push(key);
      verifiedData.push(transaction ? transaction.verifiedCustomers : 0);
      unverifiedData.push(transaction ? transaction.unverifiedCustomers : 0);
      totalData.push(transaction ? transaction.totalCustomers : 0);
    }

    return {
      categories,
      series: [
        { name: "Verified Customers", data: verifiedData },
        { name: "Unverified Customers", data: unverifiedData },
        { name: "Total Customers", data: totalData },
      ],
    };
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw new Error("Error fetching customer data");
  }
}

}


export const userService = new UserService();
