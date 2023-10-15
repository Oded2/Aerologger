export const load = async ({ parent }) => {
  const { supabase, session } = await parent()
  const { data: tableData } = await supabase.from('Logs').select();
  return {
    logs: tableData
  }
}