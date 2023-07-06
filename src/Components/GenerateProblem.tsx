import { useEffect, useState } from "react";
import { Card2 } from "./Card2";
import { useContextProblem } from "../context/ProblemContext";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function GenerateProblem() {
  const object = useContextProblem();
  const navigate = useNavigate();

  const [result, setResult] = useState({
    constraintsMethod: {},
    numberVariablesMethod: Array.from({
      length: object.data.numberVariable,
    }).map(() => ({})),
    method: object.data.method,
    option: object.data.option,
    type: object.data.type,
  });

  async function loadData() {
    const response = await fetch("http://localhost:3000/data", {
      method: "get",
    });
    const data = await response.json();
  }

  useEffect(() => {
    loadData();
  }, []);

  async function postData() {
    await fetch("http://localhost:3000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Math.random(),
        numberVariablesMethod: result.numberVariablesMethod,
        constraintsMethod: result.constraintsMethod,
        method: object.data.method,
        option: object.data.option,
        type: object.data.type,
      }),
    }).then((data) => data.json());
  }

  function HandleChangesVariable(row: number, item: string, value: string) {
    setResult((previousState) => {
      const numberVariablesMethod = previousState.numberVariablesMethod.map(
        (original, index) => {
          if (index === row) {
            return {
              ...original,
              [item]: value,
            };
          }
          return original;
        }
      );

      return {
        ...previousState,
        numberVariablesMethod,
      };
    });
  }

  function HandleChangesConstraints(item: string, value: string) {
    setResult((previousState) => ({
      ...previousState,
      constraintsMethod: {
        ...previousState.constraintsMethod,
        [item]: value,
      },
    }));
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    await postData();

    if (object.data.type === "Graph") {
      navigate("/AuxPage");
    } else {
      navigate("/PivotArray");
    }
  }

  return (
    <div>
      <Card2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <strong style={{ color: "white" }}>Função</strong>
          </div>

          <div
            style={{
              display: "flex",
              marginBottom: "1.5rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Array.from({
              length: object.data.numberConstraints,
            }).map((item, index) => {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    style={{ marginLeft: "0.5rem" }}
                    name="InputRestrictions"
                    id="InputRestrictions"
                    label={`x${index + 1}`}
                    type="number"
                    sx={{
                      "& input": {
                        color: "#87ceeb",
                      },
                    }}
                    focused
                    onChange={(event) =>
                      HandleChangesConstraints(
                        `x${index + 1}`,
                        event.target.value
                      )
                    }
                    InputProps={{ inputProps: { min: 1 } }}
                    required
                  />
                  {index != object.data.numberConstraints - 1 ? (
                    <strong style={{ marginLeft: "0.5rem", color: "white" }}>
                      +
                    </strong>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div>
            {Array.from({
              length: object.data.numberVariable,
            }).map((_, row) => {
              return (
                <div style={{ display: "flex", marginBottom: "1.5rem" }}>
                  {Array.from({
                    length: object.data.numberConstraints,
                  }).map((item, column) => {
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          name="InputRestrictions"
                          id="InputRestrictions"
                          label={`x${column + 1}`}
                          type="number"
                          sx={{
                            "& input": {
                              color: "#87ceeb",
                            },
                          }}
                          focused
                          onChange={(event) =>
                            HandleChangesVariable(
                              row,
                              `x${column + 1}`,
                              event.target.value
                            )
                          }
                          InputProps={{ inputProps: { min: 1 } }}
                          required
                        />
                        {column != object.data.numberConstraints - 1 ? (
                          <strong
                            style={{
                              color: "white" ,
                              marginLeft: "0.5rem",
                              marginRight: "0.5rem",
                            }}
                          >
                            +
                          </strong>
                        ) : null}
                      </div>
                    );
                  })}

                  <select
                    onChange={(event) =>
                      HandleChangesVariable(row, "simbol", event.target.value)
                    }
                    style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
                    required
                  >
                    <option value="" selected disabled hidden></option>
                    <option value="<=">{"<="}</option>
                    <option value="="> {"="}</option>
                    <option value=">=">{">="}</option>
                  </select>

                  <TextField
                    name="InputRestrictions"
                    id="InputRestrictions"
                    type="number"
                    sx={{
                      "& input": {
                        color: "#87ceeb",
                      },
                    }}
                    focused
                    onChange={(event) =>
                      HandleChangesVariable(row, "result", event.target.value)
                    }
                    required
                  />
                </div>
              );
            })}
          </div>
          <footer
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#000080",
                fontSize: "18px",
              }}
            >
              Calcular
            </Button>
          </footer>
        </form>
      </Card2>
    </div>
  );
}
