import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import "./TableEditorCss.css"; // CSS dosyasını bağlayın

const TableEditor = () => {
  const [columns, setColumns] = useState(["Akademik Olay", "Başlangıç Tarihi", "Bitiş Tarihi"]);
  const [rows, setRows] = useState([["", "", ""], ["", "", ""]]);
  const [mergeSelection, setMergeSelection] = useState([]);
  const [editingColumnIndex, setEditingColumnIndex] = useState(null);
    // Başlıkları Birleştir
  const handleMergeHeaders = () => {
    if (mergeSelection.length < 2) {
      alert("Birleştirme için en az iki başlık seçmelisiniz.");
      return;
    }

    const [[_, firstColIndex]] = mergeSelection;

    const isSameHeaderRow = mergeSelection.every(([r]) => r === -1); // Başlık satırı kontrolü
    if (!isSameHeaderRow) {
      alert("Birleştirme sadece aynı satırdaki başlıklar için yapılabilir.");
      return;
    }

    const updatedColumns = [...columns];
    const mergedContent = mergeSelection.map(([_, c]) => columns[c]).join(" - ");

    updatedColumns[firstColIndex] = {
      content: mergedContent,
      colSpan: mergeSelection.length,
    };

    mergeSelection.slice(1).forEach(([_, c]) => {
      updatedColumns[c] = null;
    });

    setColumns(updatedColumns);
    setMergeSelection([]);
  };

  // Hücreleri Birleştir
  const handleMergeColumnsInRow = () => {
    if (mergeSelection.length < 2) {
      alert("Birleştirme için en az iki hücre seçmelisiniz.");
      return;
    }

    const [[rowIndex, firstColIndex]] = mergeSelection;

    const isSameRow = mergeSelection.every(([r]) => r === rowIndex);
    if (!isSameRow) {
      alert("Birleştirme sadece aynı satırdaki hücreler için yapılabilir.");
      return;
    }

    const updatedRows = [...rows];
    const mergedContent = mergeSelection.map(([r, c]) => rows[r][c]).join(" - ");

    updatedRows[rowIndex][firstColIndex] = {
      content: mergedContent,
      colSpan: mergeSelection.length,
    };

    mergeSelection.slice(1).forEach(([r, c]) => {
      updatedRows[r][c] = null;
    });

    setRows(updatedRows);
    setMergeSelection([]);
  };

  // Hücre veya Başlık Seçimi
  const toggleCellSelection = (rowIndex, columnIndex) => {
    const isSelected = mergeSelection.some(([r, c]) => r === rowIndex && c === columnIndex);

    if (isSelected) {
      setMergeSelection(mergeSelection.filter(([r, c]) => r !== rowIndex || c !== columnIndex));
    } else {
      setMergeSelection([...mergeSelection, [rowIndex, columnIndex]]);
    }
  };

  // Başlık Düzenleme
  const handleColumnEdit = (index, newName) => {
    const updatedColumns = [...columns];
    if (typeof updatedColumns[index] === "object") {
      updatedColumns[index].content = newName;
    } else {
      updatedColumns[index] = newName;
    }
    setColumns(updatedColumns);
    setEditingColumnIndex(null); // Düzenleme modundan çık
  };

  const handleAddColumn = () => {
    const newColumnName = prompt("Yeni sütun adını girin (boş bırakabilirsiniz):") || `Sütun ${columns.length + 1}`;
    setColumns([...columns, newColumnName]);
    setRows(rows.map((row) => [...row, ""]));
  };

  const handleAddRowBelow = () => {
    if (mergeSelection.length === 0) {
      alert("Alt satır eklemek için bir hücre seçmelisiniz.");
      return;
    }

    const [selectedRowIndex] = mergeSelection[0];
    const newRow = columns.map(() => "");
    const updatedRows = [...rows];
    updatedRows.splice(selectedRowIndex + 1, 0, newRow);
    setRows(updatedRows);
    setMergeSelection([]);
  };

  const handleDeleteRow = () => {
    if (mergeSelection.length === 0) {
      alert("Satırı silmek için bir hücre seçmelisiniz.");
      return;
    }

    const [selectedRowIndex] = mergeSelection[0];
    const updatedRows = [...rows];
    updatedRows.splice(selectedRowIndex, 1);
    setRows(updatedRows);
    setMergeSelection([]);
  };

  const handleDeleteColumn = () => {
    if (mergeSelection.length === 0) {
      alert("Sütunu silmek için bir sütun başlığı seçmelisiniz.");
      return;
    }

    const [[_, selectedColIndex]] = mergeSelection;
    const updatedColumns = [...columns];
    updatedColumns.splice(selectedColIndex, 1);

    const updatedRows = rows.map((row) => {
      const newRow = [...row];
      newRow.splice(selectedColIndex, 1);
      return newRow;
    });

    setColumns(updatedColumns);
    setRows(updatedRows);
    setMergeSelection([]);
  };

  const handleCellChange = (rowIndex, columnIndex, value) => {
    const updatedRows = [...rows];
    const currentCell = updatedRows[rowIndex][columnIndex];
    // Eğer hücre birleşik bir hücre ise
      if (currentCell && currentCell.content) {
        updatedRows[rowIndex][columnIndex] = {
          ...currentCell, // Mevcut colSpan ve diğer özellikleri koru
          content: value, // İçeriği güncelle
        };
      } else {
        // Normal hücre güncellemesi
        updatedRows[rowIndex][columnIndex] = value;
  }

    setRows(updatedRows);
  };

  return (
    <div className="custom-table-container">
      <h2 className="custom-table-title">Gelişmiş Tablo Düzenleyici</h2>

      <div className="custom-table-toolbar">
        <Button variant="primary" onClick={handleAddColumn}>
          Sütun Ekle
        </Button>
        <Button variant="warning" onClick={handleMergeColumnsInRow}>
          Hücreleri Birleştir
        </Button>
        <Button variant="warning" onClick={handleMergeHeaders}>
          Başlıkları Birleştir
        </Button>
        <Button variant="success" onClick={handleAddRowBelow}>
          Alt Satır Ekle
        </Button>
        <Button variant="danger" onClick={handleDeleteRow}>
          Satırı Sil
        </Button>
        <Button variant="danger" onClick={handleDeleteColumn}>
          Sütunu Sil
        </Button>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            {columns.map((column, index) => {
              if (column === null) return null;

              const isSelected = mergeSelection.some(([r, c]) => r === -1 && c === index);

              return (
                <th
                  key={index}
                  colSpan={column?.colSpan || 1}
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "lightblue" : "white",
                  }}
                  onClick={() => toggleCellSelection(-1, index)} // Başlık seçimi
                  onDoubleClick={() => setEditingColumnIndex(index)} // Düzenleme
                >
                  {editingColumnIndex === index ? (
                    <input
                      type="text"
                      defaultValue={column?.content || column}
                      onBlur={(e) => handleColumnEdit(index, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    column?.content || column
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((_, columnIndex) => {
                const cell = row[columnIndex];

                if (cell && cell.colSpan) {
                  return (
                    <td
                      key={columnIndex}
                      colSpan={cell.colSpan}
                      style={{
                        textAlign: "center",
                        backgroundColor: "blue",
                        cursor: "pointer",
                      }}
                      onDoubleClick={() => handleCellChange(rowIndex, columnIndex, prompt("Yeni içerik girin:", cell.content))}
                    >
                      {cell.content}
                    </td>
                  );
                }

                if (cell === null) return null;

                return (
                  <td
                    key={columnIndex}
                    style={{
                      textAlign: "center",
                      backgroundColor: mergeSelection.some(
                        ([r, c]) => r === rowIndex && c === columnIndex
                      )
                        ? "lightblue"
                        : "white",
                    }}
                    onClick={() => toggleCellSelection(rowIndex, columnIndex)}
                  >
                    <div
                      onDoubleClick={() =>
                        handleCellChange(rowIndex, columnIndex, prompt("Yeni değer girin:", row[columnIndex]))
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      {row[columnIndex] || "Düzenle"}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableEditor;
