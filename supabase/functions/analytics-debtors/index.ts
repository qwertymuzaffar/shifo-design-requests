import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DebtorModel {
  patientId: number;
  fullName: string;
  phone: string;
  totalDebt: number;
  unpaidServicesCount: number;
  lastVisitDate: string | null;
}

const mockDebtors: DebtorModel[] = [
  {
    patientId: 1,
    fullName: "Иванов Иван Иванович",
    phone: "+992901234567",
    totalDebt: 2500,
    unpaidServicesCount: 3,
    lastVisitDate: "2024-12-20"
  },
  {
    patientId: 2,
    fullName: "Петрова Мария Сергеевна",
    phone: "+992907654321",
    totalDebt: 1800,
    unpaidServicesCount: 2,
    lastVisitDate: "2024-12-18"
  },
  {
    patientId: 3,
    fullName: "Сидоров Петр Александрович",
    phone: "+992901112233",
    totalDebt: 3200,
    unpaidServicesCount: 4,
    lastVisitDate: "2024-12-15"
  },
  {
    patientId: 4,
    fullName: "Алиева Фатима Рахимовна",
    phone: "+992903334455",
    totalDebt: 1500,
    unpaidServicesCount: 2,
    lastVisitDate: "2024-12-22"
  },
  {
    patientId: 5,
    fullName: "Рахимов Джамшед Исламович",
    phone: "+992905556677",
    totalDebt: 4100,
    unpaidServicesCount: 5,
    lastVisitDate: "2024-12-10"
  },
  {
    patientId: 6,
    fullName: "Каримова Лола Азизовна",
    phone: "+992907778899",
    totalDebt: 2900,
    unpaidServicesCount: 3,
    lastVisitDate: "2024-12-19"
  },
  {
    patientId: 7,
    fullName: "Назаров Фаррух Махмудович",
    phone: "+992909990011",
    totalDebt: 950,
    unpaidServicesCount: 1,
    lastVisitDate: "2024-12-21"
  },
  {
    patientId: 8,
    fullName: "Юсупова Нигора Саидовна",
    phone: "+992902223344",
    totalDebt: 3750,
    unpaidServicesCount: 4,
    lastVisitDate: "2024-12-12"
  }
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const sortedDebtors = [...mockDebtors].sort((a, b) => b.totalDebt - a.totalDebt);

    const response = {
      data: sortedDebtors,
      total: sortedDebtors.length
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
