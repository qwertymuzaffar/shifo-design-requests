import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DeferredAppointment {
  id: string;
  patient_id: number;
  procedure_id: number | null;
  procedure_name: string;
  notes: string | null;
  status: string;
  assigned_doctor_id: number | null;
  created_at: string;
  updated_at: string;
  patient?: {
    id: number;
    full_name: string;
    phone: string;
  };
  procedure?: {
    id: number;
    name: string;
    price: number;
  };
  assigned_doctor?: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (req.method === "GET") {
      if (pathParts.length === 1) {
        const status = url.searchParams.get("status");

        let query = supabase
          .from("deferred_appointments")
          .select(`
            *,
            patient:patients!patient_id (
              id,
              full_name,
              phone
            ),
            procedure:procedures!procedure_id (
              id,
              name,
              price
            ),
            assigned_doctor:doctors!assigned_doctor_id (
              id,
              user:users!user_id (
                first_name,
                last_name
              )
            )
          `)
          .order("created_at", { ascending: false });

        if (status) {
          query = query.eq("status", status);
        }

        const { data, error } = await query;

        if (error) throw error;

        return new Response(JSON.stringify(data || []), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }

      if (pathParts.length === 2) {
        const id = pathParts[1];
        const { data, error } = await supabase
          .from("deferred_appointments")
          .select(`
            *,
            patient:patients!patient_id (
              id,
              full_name,
              phone
            ),
            procedure:procedures!procedure_id (
              id,
              name,
              price
            ),
            assigned_doctor:doctors!assigned_doctor_id (
              id,
              user:users!user_id (
                first_name,
                last_name
              )
            )
          `)
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          return new Response(
            JSON.stringify({ error: "Appointment not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { data, error } = await supabase
        .from("deferred_appointments")
        .insert({
          patient_id: body.patient_id,
          procedure_id: body.procedure_id,
          procedure_name: body.procedure_name,
          notes: body.notes,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (req.method === "PATCH") {
      if (pathParts.length >= 2) {
        const id = pathParts[1];
        const isTakeAction = pathParts[2] === "take";
        const body = await req.json();

        const updateData: any = {
          updated_at: new Date().toISOString(),
        };

        if (isTakeAction) {
          updateData.status = "taken";
          updateData.assigned_doctor_id = body.assigned_doctor_id;
        } else {
          if (body.status !== undefined) updateData.status = body.status;
          if (body.assigned_doctor_id !== undefined) updateData.assigned_doctor_id = body.assigned_doctor_id;
          if (body.notes !== undefined) updateData.notes = body.notes;
        }

        const { data, error } = await supabase
          .from("deferred_appointments")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    }

    if (req.method === "DELETE") {
      if (pathParts.length === 2) {
        const id = pathParts[1];
        const { error } = await supabase
          .from("deferred_appointments")
          .delete()
          .eq("id", id);

        if (error) throw error;

        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
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
