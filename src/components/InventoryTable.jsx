import { useState } from "react";
import { inventoryApi } from "../api";

export default function InventoryTable({ items = [], onRefresh }) {
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState({});
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "General",
    quantity: 0,
    unit: "pcs",
    price: 0,
    lowStockThreshold: 5,
  });
  const [search, setSearch] = useState("");

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const startEdit = (item) => {
    setEditing(item._id);
    setEditVal({ quantity: item.quantity, price: item.price });
  };
  const saveEdit = async (id) => {
    await inventoryApi.update(id, editVal);
    setEditing(null);
    onRefresh();
  };
  const deleteItem = async (id) => {
    if (window.confirm("Delete this item?")) {
      await inventoryApi.remove(id);
      onRefresh();
    }
  };
  const addItem = async () => {
    if (!newItem.name) return;
    await inventoryApi.add(newItem);
    setAdding(false);
    setNewItem({
      name: "",
      category: "General",
      quantity: 0,
      unit: "pcs",
      price: 0,
      lowStockThreshold: 5,
    });
    onRefresh();
  };

  const thStyle = {
    fontSize: 11,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 600,
    padding: "10px 14px",
    textAlign: "left",
    borderBottom: "2px solid var(--border)",
    background: "var(--bg3)",
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "12px 14px",
    fontSize: 13,
    color: "var(--text)",
    borderBottom: "1px solid var(--border)",
  };

  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          style={{
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 13,
            color: "var(--text)",
            outline: "none",
            width: 220,
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--purple)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        <button
          onClick={() => setAdding(true)}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            background: "var(--purple)",
            border: "none",
            color: "white",
            fontSize: 13,
            fontWeight: 500,
            boxShadow: "0 2px 6px rgba(109,40,217,0.25)",
          }}
        >
          + Add Item
        </button>
      </div>

      {adding && (
        <div
          style={{
            margin: "16px",
            padding: 16,
            background: "var(--bg3)",
            borderRadius: 10,
            border: "1px solid var(--border)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
          }}
        >
          <input
            placeholder="Item name *"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            style={{ gridColumn: "1/-1", ...inputStyle }}
          />
          <input
            placeholder="Category"
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            style={inputStyle}
          />
          <input
            placeholder="Unit (pcs/kg/L)"
            value={newItem.unit}
            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Qty"
            value={newItem.quantity}
            onChange={(e) =>
              setNewItem({ ...newItem, quantity: +e.target.value })
            }
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Price ₹"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: +e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Low stock alert at"
            value={newItem.lowStockThreshold}
            onChange={(e) =>
              setNewItem({ ...newItem, lowStockThreshold: +e.target.value })
            }
            style={inputStyle}
          />
          <div style={{ gridColumn: "1/-1", display: "flex", gap: 8 }}>
            <button
              onClick={addItem}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                background: "var(--teal)",
                border: "none",
                color: "white",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Save Item
            </button>
            <button
              onClick={() => setAdding(false)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "white",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                fontSize: 13,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                "Item",
                "Category",
                "Stock",
                "Unit",
                "Price ₹",
                "Status",
                "Actions",
              ].map((h) => (
                <th key={h} style={thStyle}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    ...tdStyle,
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: 32,
                  }}
                >
                  No items found
                </td>
              </tr>
            )}
            {filtered.map((item) => {
              const isLow = item.quantity <= item.lowStockThreshold;
              const isEdit = editing === item._id;
              return (
                <tr
                  key={item._id}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#FAFBFF")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "white")
                  }
                >
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500, color: "var(--text)" }}>
                      {item.name}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--purple)",
                        background: "var(--purple-xl)",
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontWeight: 500,
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {isEdit ? (
                      <input
                        type="number"
                        value={editVal.quantity}
                        onChange={(e) =>
                          setEditVal({ ...editVal, quantity: +e.target.value })
                        }
                        style={{ ...inputStyle, width: 70 }}
                      />
                    ) : (
                      <span
                        style={{
                          fontWeight: 700,
                          color: isLow ? "var(--coral)" : "var(--text)",
                          fontSize: 15,
                        }}
                      >
                        {item.quantity}
                      </span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--muted)" }}>
                    {item.unit}
                  </td>
                  <td style={tdStyle}>
                    {isEdit ? (
                      <input
                        type="number"
                        value={editVal.price}
                        onChange={(e) =>
                          setEditVal({ ...editVal, price: +e.target.value })
                        }
                        style={{ ...inputStyle, width: 80 }}
                      />
                    ) : (
                      <span style={{ fontWeight: 500 }}>₹{item.price}</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontWeight: 600,
                        background: isLow
                          ? "var(--coral-xl)"
                          : "var(--green-xl)",
                        color: isLow ? "var(--coral)" : "var(--green)",
                        border: `1px solid ${isLow ? "#FECDD3" : "#A7F3D0"}`,
                      }}
                    >
                      {isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {isEdit ? (
                        <>
                          <button
                            onClick={() => saveEdit(item._id)}
                            style={actionBtn("#0D9488", "#CCFBF1")}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            style={actionBtn("#64748B", "#F1F5F9")}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(item)}
                            style={actionBtn("#6D28D9", "#EDE9FE")}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(item._id)}
                            style={actionBtn("#E11D48", "#FFE4E6")}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  background: "white",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: "7px 10px",
  fontSize: 13,
  color: "var(--text)",
  outline: "none",
  width: "100%",
};
const actionBtn = (color, bg) => ({
  fontSize: 11,
  padding: "5px 10px",
  borderRadius: 6,
  background: bg,
  border: `1px solid ${color}30`,
  color: color,
  cursor: "pointer",
  fontWeight: 500,
});
