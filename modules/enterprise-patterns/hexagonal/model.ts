/** A claims-approval core, with adapters you can swap on three ports (illustrative). */

export type Arch = "layered" | "hex";
export type Port = "input" | "store" | "notify";

export const ADAPTERS: Record<Port, { name: string; options: string[] }> = {
  input: {
    name: "Receive claim (driving)",
    options: ["Web form", "Mobile app", "Nightly batch file", "Automated test"],
  },
  store: {
    name: "Load policy (driven)",
    options: ["PostgreSQL", "Legacy mainframe", "In-memory fake"],
  },
  notify: { name: "Notify customer (driven)", options: ["SMS", "Email", "Test spy"] },
};

export const CORE_HEX = `class ApproveClaim:
    def __init__(self, policies: PolicyStore, notifier: Notifier):
        ...
    def handle(self, claim):
        policy = self.policies.find(claim.policy_id)
        if policy.active and claim.amount < 50_000:
            claim.approve()
            self.notifier.tell(claim.customer, "Approved")`;

export const CORE_LAYERED = `class ApproveClaim:
    def handle(self, claim):
        row = db.execute("SELECT active FROM policies WHERE id=%s",
                         claim.policy_id)
        if row.active and claim.amount < 50_000:
            claim.approve()
            SmsGateway("api-key").send(claim.phone, "Approved")`;

export function consequences(arch: Arch, changed: Port[]) {
  const coreEdits = arch === "layered" ? changed.filter((p) => p !== "input").length : 0;
  return {
    coreEdits,
    testable: arch === "hex",
  };
}
