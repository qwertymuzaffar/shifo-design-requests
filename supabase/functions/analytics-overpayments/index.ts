import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OverpaymentModel {
  patientId: number;
  fullName: string;
  phone: string;
  totalOverpayment: number;
  prepaidServicesCount: number;
  lastPrepaymentDate: string | null;
}

const mockOverpayments: OverpaymentModel[] = [
  {
    patientId: 10,
    fullName: "Ахмедова Саодат Бахромовна",
    phone: "+992901234509",
    totalOverpayment: 3500,
    prepaidServicesCount: 4,
    lastPrepaymentDate: "2024-12-20"
  },
  {
    patientId: 11,
    fullName: "Мамадов Фарход Муродович",
    phone: "+992907654310",
    totalOverpayment: 2200,
    prepaidServicesCount: 3,
    lastPrepaymentDate: "2024-12-19"
  },
  {
    patientId: 12,
    fullName: "Хакимова Гульчехра Алимовна",
    phone: "+992901112211",
    totalOverpayment: 5000,
    prepaidServicesCount: 6,
    lastPrepaymentDate: "2024-12-22"
  },
  {
    patientId: 13,
    fullName: "Шарипов Рустам Хайруллоевич",
    phone: "+992903334412",
    totalOverpayment: 1800,
    prepaidServicesCount: 2,
    lastPrepaymentDate: "2024-12-18"
  },
  {
    patientId: 14,
    fullName: "Азизова Мадина Жамшедовна",
    phone: "+992905556613",
    totalOverpayment: 4200,
    prepaidServicesCount: 5,
    lastPrepaymentDate: "2024-12-21"
  },
  {
    patientId: 15,
    fullName: "Назаров Шариф Фаррухович",
    phone: "+992907778814",
    totalOverpayment: 2800,
    prepaidServicesCount: 3,
    lastPrepaymentDate: "2024-12-17"
  },
  {
    patientId: 16,
    fullName: "Сафарова Дильбар Саидовна",
    phone: "+992909990015",
    totalOverpayment: 1200,
    prepaidServicesCount: 2,
    lastPrepaymentDate: "2024-12-16"
  },
  {
    patientId: 17,
    fullName: "Рахмонов Далер Фарходович",
    phone: "+992902223316",
    totalOverpayment: 3300,
    prepaidServicesCount: 4,
    lastPrepaymentDate: "2024-12-15"
  },
  {
    patientId: 18,
    fullName: "Иброгимова Нилуфар Махмудовна",
    phone: "+992904445517",
    totalOverpayment: 950,
    prepaidServicesCount: 1,
    lastPrepaymentDate: "2024-12-14"
  },
  {
    patientId: 19,
    fullName: "Холов Фаридун Рахмонович",
    phone: "+992906667718",
    totalOverpayment: 2500,
    prepaidServicesCount: 3,
    lastPrepaymentDate: "2024-12-13"
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
    const sortedOverpayments = [...mockOverpayments].sort((a, b) => b.totalOverpayment - a.totalOverpayment);

    const response = {
      data: sortedOverpayments,
      total: sortedOverpayments.length
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
