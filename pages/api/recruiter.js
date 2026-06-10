import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { action, email } = req.query;

  try {
    if (action === "stats") {
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title, company, location, type, created_at")
        .eq("email", email)
        .order("created_at", { ascending: false });

      const jobIds = (jobs || []).map(function(j) { return j.id; });

      let applications = [];
      if (jobIds.length > 0) {
        const { data } = await supabase
          .from("applications")
          .select("*")
          .in("job_id", jobIds)
          .order("created_at", { ascending: false });
        applications = data || [];
      }

      const pending = applications.filter(function(a) { return a.status === "pending"; }).length;
      const reviewed = applications.filter(function(a) { return a.status === "reviewed"; }).length;
      const accepted = applications.filter(function(a) { return a.status === "accepted"; }).length;

      res.status(200).json({
        jobs: jobs || [],
        applications,
        stats: {
          totalJobs: (jobs || []).length,
          totalApplications: applications.length,
          pending,
          reviewed,
          accepted,
        }
      });

    } else if (action === "update-status") {
      const { id, status } = req.query;
      await supabase.from("applications").update({ status }).eq("id", id);
      res.status(200).json({ success: true });

    } else if (action === "delete-job") {
      const { id } = req.query;
      await supabase.from("jobs").delete().eq("id", id);
      res.status(200).json({ success: true });

    } else {
      res.status(400).json({ error: "Action invalide" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
