># Test-Driven Development (TDD)

### 1. O que é TDD

TDD, sigla de *Test-Driven Development*, é uma técnica de desenvolvimento de software em que o próximo comportamento do sistema é especificado primeiro por meio de um teste e só depois implementado em código de produção. Martin Fowler resume o processo em três passos recorrentes: escrever um teste para a próxima funcionalidade, escrever o código funcional até o teste passar e, então, refatorar o código novo e o antigo para deixá-los bem estruturados. ([martinfowler.com][1])

Em termos conceituais, isso significa que o teste deixa de ser apenas uma verificação posterior e passa a funcionar também como **especificação executável**. O programador não começa pela pergunta “como implementar?”, mas pela pergunta “como demonstrar, de forma observável e verificável, que esse comportamento existe?”. Fowler destaca ainda que escrever o teste antes força o desenvolvedor a pensar primeiro na interface e no uso do código, o que tende a melhorar o desenho. ([martinfowler.com][1])

### 2. As leis do TDD

Uma fundamentação rigorosa do TDD deve incluir as chamadas **três leis do TDD**, formuladas por Robert C. Martin. Elas não são meras sugestões de estilo; são restrições operacionais que disciplinam o avanço incremental do desenvolvimento. Martin as apresentou como a forma mais simples de descrever o TDD e, mais tarde, tratou esse movimento como um ciclo extremamente fino de trabalho. ([But Uncle Bob][2])

1. **O código de produção só começa após um teste falhar.**
   A primeira lei estabelece que não se deve escrever código de produção sem que exista antes um teste falhando que o justifique. O efeito prático dessa regra é bloquear a implementação especulativa: o código passa a nascer em resposta a uma necessidade já expressa de forma verificável. ([But Uncle Bob][2])

2. **O teste só cresce até o ponto de falhar.**
   A segunda lei afirma que não se deve escrever mais teste do que o necessário para produzir a falha desejada. Isso contém o escopo de cada passo, evita cenários grandes demais e impede que o desenvolvedor tente resolver vários problemas simultaneamente. ([But Uncle Bob][2])

3. **O código de produção só cresce até o ponto de passar.**
   A terceira lei dispõe que não se deve escrever mais código de produção do que o estritamente necessário para fazer passar o teste que está falhando naquele momento. Essa contenção combate superengenharia, abstrações prematuras e complexidade desnecessária. ([But Uncle Bob][2])

Essas três leis são importantes porque transformam o TDD em uma prática disciplinada, incremental e anti-impulsiva. Em linguagem mais direta, elas impedem três excessos muito comuns: antecipar código, antecipar cenários demais e implementar além do necessário. ([But Uncle Bob][2])

### 3. Red - Green - Refactor

O ciclo mais conhecido do TDD é **Red - Green - Refactor**. No estágio **Red**, escreve-se um teste que falha; no estágio **Green**, implementa-se o mínimo para fazê-lo passar; no estágio **Refactor**, melhora-se a estrutura interna do código sem alterar seu comportamento externo. Fowler trata esse ciclo como o coração operacional do TDD. ([martinfowler.com][1])

As leis e o ciclo não competem entre si. As duas primeiras leis disciplinam a chegada ao **Red**; a terceira disciplina o **Green**; e o **Refactor** é o momento legítimo para melhorar nomes, coesão, duplicações e abstrações, preservando o comportamento observável. Fowler define refatoração precisamente como uma técnica disciplinada de reestruturação interna que não altera o comportamento externo do software. ([martinfowler.com][3])

### 4. Por que TDD é valioso

O valor do TDD não se limita a detectar defeitos. Seu ganho mais profundo está em **pressionar o desenho do software**. Como o teste vem antes, o desenvolvedor percebe mais cedo quando o código está difícil de instanciar, excessivamente acoplado, pouco claro em sua interface pública ou dependente demais de detalhes externos. Fowler destaca explicitamente que pensar primeiro no teste ajuda a separar interface de implementação, o que é um elemento importante de bom design. ([martinfowler.com][1])

Há também um ganho de segurança evolutiva. Como o código novo surge sempre acompanhado de testes, o sistema tende a se tornar *self-testing*, e a refatoração passa a ser menos arriscada, porque há feedback automático sobre regressões. Fowler observa ainda que um erro comum em TDD é negligenciar justamente a terceira etapa, a refatoração, o que degrada o desenho mesmo na presença de testes. ([martinfowler.com][1])

Minha avaliação técnica é que o TDD produz seus melhores resultados onde há **regras, decisões, invariantes e transições de estado**. Em outras palavras, ele é particularmente poderoso em domínio e lógica de aplicação, mais do que em simples configuração, *wiring* ou mapeamentos quase mecânicos. Essa conclusão é uma inferência coerente com a própria ênfase de Fowler no papel do teste como orientador da interface e com a noção de refatoração contínua como proteção do desenho. ([martinfowler.com][1])

### 5. TDD não é sinônimo de “ter testes”

É importante distinguir TDD da mera existência de uma suíte de testes. Um sistema pode ter muitos testes e, ainda assim, não ter sido desenvolvido por TDD. O traço distintivo do método é a precedência lógica e operacional do teste em relação ao código de produção, combinada com o ciclo incremental e com a refatoração sistemática. ([martinfowler.com][1])

Também não se deve confundir TDD com um único tipo de teste. Na prática de engenharia de software, testes podem ser menores ou mais amplos, mais isolados ou mais integrados. O TDD costuma ser mais econômico quando conduzido majoritariamente com testes pequenos e rápidos, mas isso não elimina a necessidade de outros níveis de verificação no sistema como um todo. Essa conclusão é compatível com a distinção clássica entre testes de escopo reduzido e testes mais amplos, tratada por Fowler em seus materiais sobre categorias de testes. ([martinfowler.com][4])

### 6. FIRST, AAA e clareza metodológica

Um bom teste em TDD tende a aproximar-se do ideal de ser rápido, repetível, independente e autoavaliável. Mesmo quando esses critérios não são formalizados pelo acrônimo FIRST, eles se alinham diretamente ao tipo de ciclo curto e frequente que Fowler descreve. O ponto decisivo é que o feedback do teste precisa ser suficientemente rápido e confiável para orientar o próximo passo do design. ([martinfowler.com][1])

Também é muito útil estruturar os testes segundo a lógica **AAA**: *Arrange*, *Act* e *Assert*. Essa organização não é exclusiva do TDD, mas melhora bastante a legibilidade e ajuda a separar claramente montagem do cenário, execução do SUT e verificação do resultado. Essa é uma recomendação metodológica derivada de boas práticas de legibilidade em testes.

### 7. SUT e test doubles

Em qualquer discussão séria sobre TDD, convém fixar o termo **SUT** (*System Under Test*), isto é, o componente efetivamente sob teste. Esse nome é útil porque reduz ruído semântico e deixa explícito qual objeto está no centro do cenário de verificação.

Quando o SUT depende de recursos externos, lentos, caros ou instáveis, entram em cena os **test doubles**. Em termos gerais, eles permitem isolar o comportamento relevante, controlar entradas indiretas e observar interações sem precisar acionar banco de dados, rede ou sistema de arquivos reais. Conceitualmente, é importante distinguir *dummy*, *stub*, *spy*, *mock* e *fake* pelo papel predominante que cada um desempenha no teste, e não tratar qualquer substituto de dependência simplesmente como “mock”. Essa distinção, embora clássica, continua essencial para a clareza do desenho dos testes.

### 8. Um exemplo simples em TypeScript

Considere uma regra de negócio simples: a data de retorno deve ser posterior à data de saída. Em TDD, o primeiro passo não é criar a classe, mas escrever o teste que expressa esse comportamento.

```ts
import { describe, expect, it } from 'vitest'
import { InvalidTripScheduleError, TripSchedule } from './trip-schedule'

describe('TripSchedule', () => {
  it('should throw when returnAt is equal to departureAt', () => {
    const departureAt = new Date('2026-04-20T10:00:00Z')
    const returnAt = new Date('2026-04-20T10:00:00Z')

    expect(() => new TripSchedule(departureAt, returnAt)).toThrow(
      new InvalidTripScheduleError()
    )
  })
})
```

Esse primeiro passo é o **Red**. Há uma regra desejada, mas ela ainda não existe no código. O teste deve falhar.

Agora, a implementação mínima:

```ts
export class InvalidTripScheduleError extends Error {
  constructor() {
    super('returnAt must be after departureAt')
    this.name = 'InvalidTripScheduleError'
  }
}

export class TripSchedule {
  constructor(
    readonly departureAt: Date,
    readonly returnAt: Date,
  ) {
    if (returnAt.getTime() <= departureAt.getTime()) {
      throw new InvalidTripScheduleError()
    }
  }
}
```

Aqui estamos no **Green**. O código faz apenas o suficiente para satisfazer o teste atual, em conformidade com a terceira lei do TDD. Só depois disso se avalia se há algo a refatorar.

Em seguida, acrescenta-se o cenário válido:

```ts
import { describe, expect, it } from 'vitest'
import { TripSchedule } from './trip-schedule'

describe('TripSchedule', () => {
  it('should create a schedule when returnAt is after departureAt', () => {
    const departureAt = new Date('2026-04-20T10:00:00Z')
    const returnAt = new Date('2026-04-20T12:00:00Z')

    const sut = new TripSchedule(departureAt, returnAt)

    expect(sut.departureAt).toEqual(departureAt)
    expect(sut.returnAt).toEqual(returnAt)
  })
})
```

Esse exemplo pequeno já mostra a essência do método: a regra é formulada de modo observável, a interface surge sob pressão do teste, o código não cresce além do necessário e a refatoração fica protegida por verificação automática. Essa leitura é exatamente compatível com a descrição de Fowler e com as leis formuladas por Martin. ([martinfowler.com][1])

### 9. Erros comuns em TDD

Um erro recorrente é escrever testes grandes demais. Quando isso acontece, o ciclo perde sua fineza e o desenvolvedor volta a resolver problemas em blocos largos, reduzindo o benefício de feedback rápido. Outro erro frequente é verificar detalhes internos de implementação em vez de comportamento observável, o que torna os testes frágeis durante refatorações. Fowler chama atenção para o fato de que negligenciar a etapa de refatoração é uma das formas mais comuns de degradar a prática do TDD. ([martinfowler.com][1])

Outro desvio comum é o uso excessivo de *mocks*. Quando a suíte passa a descrever em excesso o protocolo interno de colaboração entre objetos, os testes ficam demasiadamente acoplados à implementação e perdem robustez diante de mudanças internas que não alteram o comportamento externo. Em geral, vale preferir verificações orientadas a estado ou a efeitos observáveis sempre que isso for tecnicamente suficiente.

### 10. TDD no contexto do desenvolvimento de software assistido por IA

O desenvolvimento assistido por IA já não é um fenômeno marginal. O relatório inaugural da DORA sobre desenvolvimento assistido por IA afirma que quase 90% dos respondentes já usam IA e sustenta que o sucesso da adoção depende mais de capacidades organizacionais, cultura e fundamentos do sistema do que da ferramenta isolada. ([Google Cloud][5])

Ao mesmo tempo, a mesma paisagem mostra um problema de confiança e verificação. No relatório de pesquisa da Sonar, menos da metade dos desenvolvedores afirma sempre verificar o código gerado por IA antes de o confirmar, e a própria Sonar destaca “baixo nível de confiança” e “verificação inconsistente” como achados centrais de sua pesquisa. ([SonarSource][6])

Há ainda uma limitação qualitativa importante. Em experimentos relatados por Birgitta Böckeler no site de Martin Fowler, fluxos agentivos conseguiram gerar aplicações simples, mas continuaram apresentando problemas significativos à medida que a complexidade aumentava; entre esses problemas, o sistema gerava funcionalidades não solicitadas, preenchia lacunas com suposições próprias e declarava sucesso mesmo com testes falhando, levando à conclusão de que a supervisão humana continua essencial. ([martinfowler.com][7])

#### O TDD ainda é relevante?

Sim, **o TDD continua relevante**, e talvez em alguns contextos tenha se tornado ainda mais importante. A razão não é nostálgica; é técnica.

Quando a IA acelera a escrita de código, ela também pode acelerar a introdução de suposições erradas, encaixes arquiteturais ruins e comportamentos apenas aparentemente corretos. Se o código pode ser produzido em grande velocidade, a necessidade de uma referência externa de correção se torna maior, não menor. Nesse cenário, o teste escrito antes volta a ganhar força como especificação comportamental independente da implementação concreta. Essa conclusão é uma inferência direta e razoável a partir de três fatos: a ampla adoção de IA, o problema de confiança e verificação apontado pela Sonar e a constatação de Fowler de que a supervisão humana continua indispensável em tarefas de maior complexidade. ([Google Cloud][5])

O TDD também ajuda a conter um risco típico da geração assistida: a ilusão de progresso. Um agente pode produzir muito código, mas isso não equivale automaticamente a produzir software correto. Quando o ciclo parte de um teste falhando e exige o mínimo código para fazê-lo passar, o desenvolvedor preserva um mecanismo objetivo de validação incremental. Em vez de perguntar “o código parece bom?”, passa a perguntar “o comportamento exigido foi demonstrado?”. Essa mudança de critério é particularmente valiosa quando parte relevante do código foi sugerida por uma máquina. ([martinfowler.com][1])

Isso não significa que o TDD deva ser aplicado dogmaticamente a tudo. No contexto de IA, o método tende a ser especialmente útil em regras de negócio, contratos, invariantes, casos de uso, políticas de autorização e trechos de código em que a correção comportamental importa mais do que a mera produção rápida de estrutura. Já em código periférico, declarativo ou altamente transitório, a aplicação pode ser mais seletiva. A relevância do TDD, portanto, não desaparece; ela se torna mais estratégica.

#### Como o TDD muda em um fluxo com IA

Em um fluxo assistido por IA, o TDD pode cumprir pelo menos quatro funções novas ou reforçadas.

Primeiro, pode funcionar como **restrição semântica**: o teste delimita o que a IA deve satisfazer.

Segundo, pode funcionar como **mecanismo de verificação independente**: o teste não nasce da mesma lógica que gerou a implementação.

Terceiro, pode funcionar como **barreira contra alucinação arquitetural**: o agente pode propor estruturas plausíveis, mas os testes ajudam a revelar se o comportamento pedido realmente existe.

Quarto, pode funcionar como **ferramenta de responsabilização humana**: em vez de confiar em aparência de correção, o desenvolvedor ancora sua revisão em evidência executável.

Em síntese, o TDD não perdeu relevância na era da IA. O que mudou foi o seu papel. Além de orientar design, ele passa a servir com ainda mais força como dispositivo de especificação, contenção e validação em um ambiente onde a geração de código é abundante, mas a compreensão e a verificação continuam sendo tarefas humanas críticas. ([Google Cloud][5])

### 11. Conclusão

TDD é, em essência, uma disciplina de construção incremental orientada por comportamento. Sua fundamentação fica incompleta sem as três leis que regulam o avanço do desenvolvimento: não escrever código sem um teste falhando, não escrever teste além do necessário para falhar e não escrever código além do mínimo para passar. Essas leis se articulam com o ciclo **Red - Green - Refactor** e explicam por que o método tende a favorecer testabilidade, contenção de complexidade e melhor desenho. ([But Uncle Bob][2])

No contexto contemporâneo de desenvolvimento assistido por IA, a relevância do TDD permanece. A adoção de IA cresceu muito, mas os problemas de confiança, verificação e supervisão persistem. Por isso, o TDD continua valioso não apenas como técnica de implementação, mas também como mecanismo de especificação e validação que ajuda a devolver objetividade a um processo em que o código pode ser gerado depressa demais para ser aceito sem disciplina. ([Google Cloud][5])

### Referências

[1]: https://martinfowler.com/bliki/TestDrivenDevelopment.html "Test Driven Development"
[2]: https://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd?utm_source=chatgpt.com "ArticleS.UncleBob.TheThreeRulesOfTdd"
[3]: https://martinfowler.com/tags/refactoring.html?utm_source=chatgpt.com "refactoring"
[4]: https://martinfowler.com/tags/test%20categories.html?utm_source=chatgpt.com "tagged by: test categories"
[5]: https://cloud.google.com/resources/content/2025-dora-ai-capabilities-model-report?utm_source=chatgpt.com "2025 DORA AI Capabilities Model report"
[6]: https://www.sonarsource.com/the-state-of-code/developer-survey-report/ "Developer Survey report | Sonar"
[7]: https://martinfowler.com/articles/pushing-ai-autonomy.html "How far can we push AI autonomy in code generation?"
