// An example of a hand-rolled object model for directed graphs

interface Vertex {
    id: string;
    dependencies?: Vertex[];
    dependents?: Vertex[];
}

const createVertex = (id: string, dependencies?: Vertex[]): Vertex => {
    const vertex = { id, dependencies };

    (dependencies ?? []).forEach(dependency => {
        if (dependency.dependents) {
            dependency.dependents.push(vertex);
        } else {
            dependency.dependents = [vertex];
        }
    });

    return vertex;
};

const looseEnvify = createVertex('loose-envify');
const scheduler = createVertex('scheduler');
const react = createVertex('react', [looseEnvify]);
const reactDom = createVertex('react-dom', [looseEnvify, scheduler]);
const regeneratorRuntime = createVertex('regenerator-runtime');
const babelRuntime = createVertex('@babel/runtime', [regeneratorRuntime]);
const redux = createVertex('redux', [babelRuntime]);
const reactRedux = createVertex('react-redux', [react, reactDom, redux]);

console.log(JSON.stringify(reactRedux, null, 2));
