import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import JSZip from "npm:jszip";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Content-Disposition"],
    maxAge: 600,
  }),
);

// Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);


// Helper function to verify auth token
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Health check endpoint
app.get("/make-server-7c04b577/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTH ROUTES ============

// Sign up endpoint
app.post("/make-server-7c04b577/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Create user with Supabase Auth
    // Automatically confirm the user's email since an email server hasn't been configured.
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      email_confirm: true,
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role, // peternak, karyawan, manajer
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Server error during signup: ${error}`);
    return c.json({ error: "Server error during signup" }, 500);
  }
});

// ============ LIVESTOCK TYPE ROUTES ============

// Create livestock type
app.post("/make-server-7c04b577/livestock-type", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { name, color } = body;

    if (!name || !color) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const livestockTypeId = `livestocktype:${Date.now()}:${Math.random().toString(36).slice(2, 11)}`;
    const livestockType = {
      id: livestockTypeId,
      name,
      color,
      createdAt: new Date().toISOString(),
    };

    await kv.set(livestockTypeId, livestockType);
    return c.json({ success: true, livestockType });
  } catch (error) {
    console.log(`Error creating livestock type: ${error}`);
    return c.json({ error: "Failed to create livestock type" }, 500);
  }
});

// Get all livestock types
app.get("/make-server-7c04b577/livestock-type", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const livestockTypes = await kv.getByPrefix("livestocktype:");
    return c.json({ livestockTypes });
  } catch (error) {
    console.log(`Error fetching livestock types: ${error}`);
    return c.json({ error: "Failed to fetch livestock types" }, 500);
  }
});

// Delete livestock type
app.delete("/make-server-7c04b577/livestock-type/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting livestock type: ${error}`);
    return c.json({ error: "Failed to delete livestock type" }, 500);
  }
});

// ============ INCOME ROUTES ============

// Create income record
app.post("/make-server-7c04b577/income", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { date, type, amount, quantity, unitPrice, description } = body;

    const incomeId = `income:${Date.now()}:${Math.random().toString(36).slice(2, 11)}`;
    const income = {
      id: incomeId,
      date,
      type, // ayam, bebek, ikan
      amount: parseFloat(amount),
      quantity: parseFloat(quantity),
      unitPrice: parseFloat(unitPrice),
      description,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    await kv.set(incomeId, income);
    return c.json({ success: true, income });
  } catch (error) {
    console.log(`Error creating income record: ${error}`);
    return c.json({ error: "Failed to create income record" }, 500);
  }
});

// Get all income records
app.get("/make-server-7c04b577/income", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const incomes = await kv.getByPrefix("income:");
    return c.json({ incomes });
  } catch (error) {
    console.log(`Error fetching income records: ${error}`);
    return c.json({ error: "Failed to fetch income records" }, 500);
  }
});

// Delete income record
app.delete("/make-server-7c04b577/income/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting income record: ${error}`);
    return c.json({ error: "Failed to delete income record" }, 500);
  }
});

// ============ EXPENSE ROUTES ============

// Create expense record
app.post("/make-server-7c04b577/expense", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { date, category, amount, quantity, unitPrice, description } = body;

    const expenseId = `expense:${Date.now()}:${Math.random().toString(36).slice(2, 11)}`;
    const expense = {
      id: expenseId,
      date,
      category, // pakan, perawatan, peralatan, gaji, lainnya
      amount: parseFloat(amount),
      quantity: parseFloat(quantity),
      unitPrice: parseFloat(unitPrice),
      description,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    await kv.set(expenseId, expense);
    return c.json({ success: true, expense });
  } catch (error) {
    console.log(`Error creating expense record: ${error}`);
    return c.json({ error: "Failed to create expense record" }, 500);
  }
});

// Get all expense records
app.get("/make-server-7c04b577/expense", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const expenses = await kv.getByPrefix("expense:");
    return c.json({ expenses });
  } catch (error) {
    console.log(`Error fetching expense records: ${error}`);
    return c.json({ error: "Failed to fetch expense records" }, 500);
  }
});

// Delete expense record
app.delete("/make-server-7c04b577/expense/:id", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting expense record: ${error}`);
    return c.json({ error: "Failed to delete expense record" }, 500);
  }
});

// ============ EMPLOYEE ROUTES ============

// Create employee
app.post("/make-server-7c04b577/employee", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { name, position, hourlyRate, monthlyTarget } = body;

    const employeeId = `employee:${Date.now()}:${Math.random().toString(36).slice(2, 11)}`;
    const employee = {
      id: employeeId,
      name,
      position,
      hourlyRate: parseFloat(hourlyRate),
      monthlyTarget: parseFloat(monthlyTarget || 0),
      createdAt: new Date().toISOString(),
    };

    await kv.set(employeeId, employee);
    return c.json({ success: true, employee });
  } catch (error) {
    console.log(`Error creating employee: ${error}`);
    return c.json({ error: "Failed to create employee" }, 500);
  }
});

// Get all employees
app.get("/make-server-7c04b577/employee", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const employees = await kv.getByPrefix("employee:");
    return c.json({ employees });
  } catch (error) {
    console.log(`Error fetching employees: ${error}`);
    return c.json({ error: "Failed to fetch employees" }, 500);
  }
});

// ============ ATTENDANCE ROUTES ============

// Clock in/out
app.post("/make-server-7c04b577/attendance", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { employeeId, type, timestamp } = body; // type: 'in' or 'out'

    const date = new Date(timestamp).toISOString().split('T')[0];
    const attendanceId = `attendance:${employeeId}:${date}`;
    
    let attendance = await kv.get(attendanceId);
    
    if (!attendance) {
      attendance = {
        id: attendanceId,
        employeeId,
        date,
        clockIn: null,
        clockOut: null,
        hours: 0,
      };
    }

    if (type === 'in') {
      attendance.clockIn = timestamp;
    } else if (type === 'out') {
      attendance.clockOut = timestamp;
      if (attendance.clockIn) {
        const clockInTime = new Date(attendance.clockIn).getTime();
        const clockOutTime = new Date(timestamp).getTime();
        attendance.hours = (clockOutTime - clockInTime) / (1000 * 60 * 60); // Convert to hours
      }
    }

    await kv.set(attendanceId, attendance);
    return c.json({ success: true, attendance });
  } catch (error) {
    console.log(`Error recording attendance: ${error}`);
    return c.json({ error: "Failed to record attendance" }, 500);
  }
});

// Get attendance records
app.get("/make-server-7c04b577/attendance", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const employeeId = c.req.query('employeeId');
    const month = c.req.query('month'); // Format: YYYY-MM

    let attendances = await kv.getByPrefix("attendance:");
    
    if (employeeId) {
      attendances = attendances.filter(a => a.employeeId === employeeId);
    }
    
    if (month) {
      attendances = attendances.filter(a => a.date?.startsWith(month));
    }

    return c.json({ attendances });
  } catch (error) {
    console.log(`Error fetching attendance records: ${error}`);
    return c.json({ error: "Failed to fetch attendance records" }, 500);
  }
});

// ============ PARTNER/PROFIT SHARING ROUTES ============

// Create partner
app.post("/make-server-7c04b577/partner", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { name, percentage } = body;

    const partnerId = `partner:${Date.now()}:${Math.random().toString(36).slice(2, 11)}`;
    const partner = {
      id: partnerId,
      name,
      percentage: parseFloat(percentage),
      createdAt: new Date().toISOString(),
    };

    await kv.set(partnerId, partner);
    return c.json({ success: true, partner });
  } catch (error) {
    console.log(`Error creating partner: ${error}`);
    return c.json({ error: "Failed to create partner" }, 500);
  }
});

// Get all partners
app.get("/make-server-7c04b577/partner", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const partners = await kv.getByPrefix("partner:");
    return c.json({ partners });
  } catch (error) {
    console.log(`Error fetching partners: ${error}`);
    return c.json({ error: "Failed to fetch partners" }, 500);
  }
});

// Calculate profit sharing for a month
app.post("/make-server-7c04b577/profit-sharing/calculate", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { month } = await c.req.json(); // Format: YYYY-MM

    // Get incomes and expenses for the month
    const incomes = await kv.getByPrefix("income:");
    const expenses = await kv.getByPrefix("expense:");
    const partners = await kv.getByPrefix("partner:");

    const monthIncomes = incomes.filter(i => i.date?.startsWith(month));
    const monthExpenses = expenses.filter(e => e.date?.startsWith(month));

    const totalIncome = monthIncomes.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpense = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const profit = totalIncome - totalExpense;

    // Calculate shares
    const shares = partners.map(partner => ({
      partnerId: partner.id,
      partnerName: partner.name,
      percentage: partner.percentage,
      amount: (profit * partner.percentage) / 100,
    }));

    // Save profit sharing record
    const profitSharingId = `profitsharing:${month}`;
    const profitSharing = {
      id: profitSharingId,
      month,
      totalIncome,
      totalExpense,
      profit,
      shares,
      calculatedAt: new Date().toISOString(),
    };

    await kv.set(profitSharingId, profitSharing);
    return c.json({ success: true, profitSharing });
  } catch (error) {
    console.log(`Error calculating profit sharing: ${error}`);
    return c.json({ error: "Failed to calculate profit sharing" }, 500);
  }
});

// Get profit sharing records
app.get("/make-server-7c04b577/profit-sharing", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profitSharings = await kv.getByPrefix("profitsharing:");
    return c.json({ profitSharings });
  } catch (error) {
    console.log(`Error fetching profit sharing records: ${error}`);
    return c.json({ error: "Failed to fetch profit sharing records" }, 500);
  }
});

// ============ REPORTS ROUTES ============

// Get monthly report
app.get("/make-server-7c04b577/reports/monthly", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const month = c.req.query('month'); // Format: YYYY-MM
    
    if (!month) {
      return c.json({ error: "Month parameter is required" }, 400);
    }

    // Get all data for the month
    const incomes = await kv.getByPrefix("income:");
    const expenses = await kv.getByPrefix("expense:");

    const monthIncomes = incomes.filter(i => i.date?.startsWith(month));
    const monthExpenses = expenses.filter(e => e.date?.startsWith(month));

    // Calculate totals
    const totalIncome = monthIncomes.reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpense = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const profit = totalIncome - totalExpense;

    // Income by type - dynamically calculate from all income types
    const incomeByType: Record<string, number> = {};
    monthIncomes.forEach(income => {
      const type = income.type;
      if (type) {
        incomeByType[type] = (incomeByType[type] || 0) + (income.amount || 0);
      }
    });

    // Expenses by category
    const expenseByCategory = {
      pakan: monthExpenses.filter(e => e.category === 'pakan').reduce((sum, e) => sum + (e.amount || 0), 0),
      perawatan: monthExpenses.filter(e => e.category === 'perawatan').reduce((sum, e) => sum + (e.amount || 0), 0),
      peralatan: monthExpenses.filter(e => e.category === 'peralatan').reduce((sum, e) => sum + (e.amount || 0), 0),
      gaji: monthExpenses.filter(e => e.category === 'gaji').reduce((sum, e) => sum + (e.amount || 0), 0),
      lainnya: monthExpenses.filter(e => e.category === 'lainnya').reduce((sum, e) => sum + (e.amount || 0), 0),
    };

    return c.json({
      month,
      totalIncome,
      totalExpense,
      profit,
      incomeByType,
      expenseByCategory,
      incomes: monthIncomes,
      expenses: monthExpenses,
    });
  } catch (error) {
    console.log(`Error generating monthly report: ${error}`);
    return c.json({ error: "Failed to generate monthly report" }, 500);
  }
});

// ============ EXPORT ROUTES ============

// Test endpoint for export
app.get("/make-server-7c04b577/export/test", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ 
      success: true, 
      message: "Export endpoint is working",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.log(`Error in export test: ${error}`);
    return c.json({ error: "Test failed" }, 500);
  }
});

// Export all data as JSON (fallback)
app.get("/make-server-7c04b577/export/json", async (c) => {
  try {
    console.log('Export JSON endpoint called');
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      console.log('Export JSON: Unauthorized user');
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get month parameter from query
    const month = c.req.query('month'); // Format: YYYY-MM
    console.log(`Export JSON: month parameter = ${month}`);

    // Get all data
    console.log('Export JSON: Fetching all data from KV store...');
    const [allIncomes, allExpenses, employees, allAttendances, partners, livestockTypes] = await Promise.all([
      kv.getByPrefix("income:"),
      kv.getByPrefix("expense:"),
      kv.getByPrefix("employee:"),
      kv.getByPrefix("attendance:"),
      kv.getByPrefix("partner:"),
      kv.getByPrefix("livestocktype:"),
    ]);
    console.log(`Export JSON: Fetched ${allIncomes.length} incomes, ${allExpenses.length} expenses, ${allAttendances.length} attendances`);

    // Filter by month if specified
    let incomes = allIncomes;
    let expenses = allExpenses;
    let attendances = allAttendances;

    if (month && month !== 'all') {
      console.log(`Export JSON: Filtering data by month ${month}`);
      incomes = allIncomes.filter(item => item && item.date && item.date.startsWith(month));
      expenses = allExpenses.filter(item => item && item.date && item.date.startsWith(month));
      attendances = allAttendances.filter(item => item && item.date && item.date.startsWith(month));
      console.log(`Export JSON: After filter - ${incomes.length} incomes, ${expenses.length} expenses, ${attendances.length} attendances`);
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      period: month && month !== 'all' ? month : 'all',
      data: {
        incomes,
        expenses,
        employees,
        attendances,
        partners,
        livestockTypes,
      },
      summary: {
        totalIncomes: incomes.length,
        totalExpenses: expenses.length,
        totalEmployees: employees.length,
        totalAttendances: attendances.length,
        totalPartners: partners.length,
        totalLivestockTypes: livestockTypes.length,
      }
    };

    console.log('Export JSON: Creating JSON string...');
    const jsonString = JSON.stringify(exportData, null, 2);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const monthSuffix = month && month !== 'all' ? `_${month}` : '';
    const filename = `Data_Peternakan${monthSuffix}_${dateStr}.json`;
    console.log(`Export JSON: Sending file ${filename}`);

    return new Response(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Disposition',
      },
    });
  } catch (error) {
    console.error(`Error exporting to JSON: ${error}`, error);
    return c.json({ error: "Failed to export data to JSON" }, 500);
  }
});

// Export all data to Excel
app.get("/make-server-7c04b577/export/excel", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all data
    const [incomes, expenses, employees, attendances, partners, livestockTypes] = await Promise.all([
      kv.getByPrefix("income:"),
      kv.getByPrefix("expense:"),
      kv.getByPrefix("employee:"),
      kv.getByPrefix("attendance:"),
      kv.getByPrefix("partner:"),
      kv.getByPrefix("livestocktype:"),
    ]);

    // Dynamic import XLSX library with default export
    const xlsxModule = await import("npm:xlsx@0.18.5");
    const XLSX = xlsxModule.default || xlsxModule;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add Pemasukan sheet
    const incomeData = incomes.map(i => ({
      'ID': i.id,
      'Tanggal': i.date,
      'Jenis Ternak': i.type,
      'Jumlah': i.amount,
      'Kuantitas': i.quantity,
      'Harga Satuan': i.unitPrice,
      'Deskripsi': i.description,
      'Dibuat Pada': i.createdAt,
    }));
    const wsIncome = XLSX.utils.json_to_sheet(incomeData);
    XLSX.utils.book_append_sheet(wb, wsIncome, "Pemasukan");

    // Add Pengeluaran sheet
    const expenseData = expenses.map(e => ({
      'ID': e.id,
      'Tanggal': e.date,
      'Kategori': e.category,
      'Jumlah': e.amount,
      'Deskripsi': e.description,
      'Dibuat Pada': e.createdAt,
    }));
    const wsExpense = XLSX.utils.json_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(wb, wsExpense, "Pengeluaran");

    // Add Karyawan sheet
    const employeeData = employees.map(e => ({
      'ID': e.id,
      'Nama': e.name,
      'Email': e.email,
      'Posisi': e.position,
      'Gaji per Jam': e.hourlyRate,
      'Dibuat Pada': e.createdAt,
    }));
    const wsEmployee = XLSX.utils.json_to_sheet(employeeData);
    XLSX.utils.book_append_sheet(wb, wsEmployee, "Karyawan");

    // Add Absensi sheet
    const attendanceData = attendances.map(a => ({
      'ID': a.id,
      'ID Karyawan': a.employeeId,
      'Tanggal': a.date,
      'Clock In': a.clockIn,
      'Clock Out': a.clockOut,
      'Total Jam': a.totalHours,
      'Total Gaji': a.totalSalary,
      'Dibuat Pada': a.createdAt,
    }));
    const wsAttendance = XLSX.utils.json_to_sheet(attendanceData);
    XLSX.utils.book_append_sheet(wb, wsAttendance, "Absensi");

    // Add Partner sheet
    const partnerData = partners.map(p => ({
      'ID': p.id,
      'Nama': p.name,
      'Email': p.email,
      'Persentase Bagi Hasil': p.sharePercentage,
      'Dibuat Pada': p.createdAt,
    }));
    const wsPartner = XLSX.utils.json_to_sheet(partnerData);
    XLSX.utils.book_append_sheet(wb, wsPartner, "Partner");

    // Add Jenis Ternak sheet
    const livestockData = livestockTypes.map(l => ({
      'ID': l.id,
      'Nama': l.name,
      'Warna': l.color,
      'Dibuat Pada': l.createdAt,
    }));
    const wsLivestock = XLSX.utils.json_to_sheet(livestockData);
    XLSX.utils.book_append_sheet(wb, wsLivestock, "Jenis Ternak");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Get current date for filename
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const filename = `Data_Peternakan_${dateStr}.xlsx`;

    return new Response(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Disposition',
      },
    });
  } catch (error) {
    console.log(`Error exporting to Excel: ${error}`);
    return c.json({ error: "Failed to export data to Excel" }, 500);
  }
});

// Simple CSV export (single file with all data)
app.get("/make-server-7c04b577/export/csv-simple", async (c) => {
  try {
    console.log('Export CSV endpoint called');
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      console.log('Export CSV: Unauthorized user');
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get month parameter from query
    const month = c.req.query('month'); // Format: YYYY-MM
    console.log(`Export CSV: month parameter = ${month}`);

    // Get all data
    console.log('Export CSV: Fetching all data from KV store...');
    const [allIncomes, allExpenses] = await Promise.all([
      kv.getByPrefix("income:"),
      kv.getByPrefix("expense:"),
    ]);
    console.log(`Export CSV: Fetched ${allIncomes.length} incomes, ${allExpenses.length} expenses`);

    // Filter by month if specified
    let incomes = allIncomes;
    let expenses = allExpenses;

    if (month && month !== 'all') {
      console.log(`Export CSV: Filtering data by month ${month}`);
      incomes = allIncomes.filter(item => item && item.date && item.date.startsWith(month));
      expenses = allExpenses.filter(item => item && item.date && item.date.startsWith(month));
      console.log(`Export CSV: After filter - ${incomes.length} incomes, ${expenses.length} expenses`);
    }

    // Helper function to convert array to CSV
    const arrayToCSV = (data: any[], headers: string[]) => {
      if (data.length === 0) return headers.join(',');
      
      const rows = data.map(item => {
        return headers.map(header => {
          const value = item[header] || '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',');
      });
      
      return [headers.join(','), ...rows].join('\n');
    };

    console.log('Export CSV: Creating CSV content...');
    // Create combined CSV
    let csvContent = "=== PEMASUKAN ===\n";
    const incomeHeaders = ['id', 'date', 'type', 'amount', 'quantity', 'unitPrice', 'description', 'createdAt'];
    csvContent += arrayToCSV(incomes, incomeHeaders);
    
    csvContent += "\n\n=== PENGELUARAN ===\n";
    const expenseHeaders = ['id', 'date', 'category', 'amount', 'description', 'createdAt'];
    csvContent += arrayToCSV(expenses, expenseHeaders);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const monthSuffix = month && month !== 'all' ? `_${month}` : '';
    const filename = `Data_Peternakan${monthSuffix}_${dateStr}.csv`;
    console.log(`Export CSV: Sending file ${filename}`);

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Disposition',
      },
    });
  } catch (error) {
    console.error(`Error exporting to CSV: ${error}`, error);
    return c.json({ error: "Failed to export data to CSV" }, 500);
  }
});

// Export all data to CSV (as ZIP)
app.get("/make-server-7c04b577/export/csv", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all data
    const [incomes, expenses, employees, attendances, partners, livestockTypes] = await Promise.all([
      kv.getByPrefix("income:"),
      kv.getByPrefix("expense:"),
      kv.getByPrefix("employee:"),
      kv.getByPrefix("attendance:"),
      kv.getByPrefix("partner:"),
      kv.getByPrefix("livestocktype:"),
    ]);

    // Helper function to convert array to CSV
    const arrayToCSV = (data: any[], headers: string[]) => {
      if (data.length === 0) return headers.join(',');
      
      const rows = data.map(item => {
        return headers.map(header => {
          const value = item[header] || '';
          // Escape quotes and wrap in quotes if contains comma or quote
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',');
      });
      
      return [headers.join(','), ...rows].join('\n');
    };

    const zip = new JSZip();

    // Create CSV for Pemasukan
    const incomeHeaders = ['id', 'date', 'type', 'amount', 'quantity', 'unitPrice', 'description', 'createdAt'];
    const incomeCSV = arrayToCSV(incomes, incomeHeaders);
    zip.file("Pemasukan.csv", incomeCSV);

    // Create CSV for Pengeluaran
    const expenseHeaders = ['id', 'date', 'category', 'amount', 'description', 'createdAt'];
    const expenseCSV = arrayToCSV(expenses, expenseHeaders);
    zip.file("Pengeluaran.csv", expenseCSV);

    // Create CSV for Karyawan
    const employeeHeaders = ['id', 'name', 'email', 'position', 'hourlyRate', 'createdAt'];
    const employeeCSV = arrayToCSV(employees, employeeHeaders);
    zip.file("Karyawan.csv", employeeCSV);

    // Create CSV for Absensi
    const attendanceHeaders = ['id', 'employeeId', 'date', 'clockIn', 'clockOut', 'totalHours', 'totalSalary', 'createdAt'];
    const attendanceCSV = arrayToCSV(attendances, attendanceHeaders);
    zip.file("Absensi.csv", attendanceCSV);

    // Create CSV for Partner
    const partnerHeaders = ['id', 'name', 'email', 'sharePercentage', 'createdAt'];
    const partnerCSV = arrayToCSV(partners, partnerHeaders);
    zip.file("Partner.csv", partnerCSV);

    // Create CSV for Jenis Ternak
    const livestockHeaders = ['id', 'name', 'color', 'createdAt'];
    const livestockCSV = arrayToCSV(livestockTypes, livestockHeaders);
    zip.file("Jenis_Ternak.csv", livestockCSV);

    // Generate ZIP
    const zipBuffer = await zip.generateAsync({ type: "uint8array" });

    // Get current date for filename
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const filename = `Data_Peternakan_${dateStr}.zip`;

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Disposition',
      },
    });
  } catch (error) {
    console.log(`Error exporting to CSV: ${error}`);
    return c.json({ error: "Failed to export data to CSV" }, 500);
  }
});

Deno.serve(app.fetch);