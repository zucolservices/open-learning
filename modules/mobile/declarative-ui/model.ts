/** The café menu, and the same screen written in three declarative frameworks. */

export interface Item {
  id: string;
  name: string;
  price: number;
  veg: boolean;
}

export const MENU: Item[] = [
  { id: "chai", name: "Masala chai", price: 40, veg: true },
  { id: "dosa", name: "Masala dosa", price: 120, veg: true },
  { id: "kebab", name: "Chicken kebab roll", price: 180, veg: false },
  { id: "idli", name: "Idli (2)", price: 70, veg: true },
  { id: "omelette", name: "Masala omelette", price: 90, veg: false },
];

export type Fw = "swiftui" | "compose" | "flutter";

export const CODE: Record<Fw, { name: string; year: string; code: string; rerun: string }> = {
  swiftui: {
    name: "SwiftUI",
    year: "Apple, 2019",
    code: `struct MenuScreen: View {
  @State private var order = Order()
  @State private var vegOnly = false

  var body: some View {
    List(menu.filter { !vegOnly || $0.veg }) { item in
      MenuRow(item: item, qty: order[item])
    }
  }
}`,
    rerun:
      "Changing @State makes SwiftUI recompute body. It compares the new rows with the old ones and updates only what differs.",
  },
  compose: {
    name: "Jetpack Compose",
    year: "Google, 2021",
    code: `@Composable
fun MenuScreen(vm: MenuViewModel) {
  val order by vm.order.collectAsState()
  val vegOnly by vm.vegOnly.collectAsState()

  LazyColumn {
    items(menu.filter { !vegOnly || it.veg }) { item ->
      MenuRow(item, qty = order[item])
    }
  }
}`,
    rerun:
      "Compose re-runs (recomposes) functions that read the changed state, and skips any MenuRow whose inputs are unchanged.",
  },
  flutter: {
    name: "Flutter",
    year: "Google, 2018",
    code: `Widget build(BuildContext context) {
  final shown =
      menu.where((i) => !vegOnly || i.veg).toList();
  return ListView.builder(
    itemCount: shown.length,
    itemBuilder: (_, i) =>
        MenuRow(item: shown[i], qty: order[shown[i]]),
  );
}`,
    rerun:
      "setState() calls build() again. Flutter compares the new widgets with its existing elements and changes only what differs on screen.",
  },
};

/** Ids of rows whose inputs differ between two screen states. */
export function changedRows(
  a: { qty: Record<string, number>; vegOnly: boolean },
  b: { qty: Record<string, number>; vegOnly: boolean },
) {
  const shownA = MENU.filter((m) => !a.vegOnly || m.veg).map((m) => m.id);
  return MENU.filter((m) => !b.vegOnly || m.veg)
    .filter((m) => !shownA.includes(m.id) || (a.qty[m.id] ?? 0) !== (b.qty[m.id] ?? 0))
    .map((m) => m.id);
}
