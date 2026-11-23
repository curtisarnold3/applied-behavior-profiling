import { Triangle } from "./Triangle";

export function SuccessTriangle() {
  return (
    <Triangle
      title="The Success Triangle"
      desc="Three trainable skills hold up every outcome: self-mastery at the top, observation at the lower right, and communication at the lower left. When a result fails, one of the three is leaking."
      caption="Fig. The Success Triangle: when a result is off, one side is leaking"
      hub={["EVERY", "OUTCOME"]}
      corners={[
        { label: "Self-mastery", note: ["how we show up"] },
        { label: "Observation", note: ["what we notice"] },
        { label: "Communication", note: ["what we say,", "and how it lands"] },
      ]}
      textVersion={
        <ul className="mt-1 list-disc pl-5">
          <li>Self-mastery: confidence, discipline, emotional control, presence.</li>
          <li>Communication: what we say, how we say it, and how the other person feels and decides in response.</li>
          <li>Observation: reading what&rsquo;s actually happening in the other person.</li>
        </ul>
      }
    />
  );
}

export function ChildhoodTriangle() {
  return (
    <Triangle
      title="The Childhood Development Triangle"
      desc="A child builds behavior around three needs: friends at the top, rewards at the lower right, and safety at the lower left. A shortfall in any one becomes a lasting adult strategy."
      caption="Fig. The Childhood Development Triangle: where one side ran short, a strategy grew"
      hub={["THE CHILD", "ADAPTS"]}
      corners={[
        { label: "Friends", note: ["What did I have to do", "to belong?"] },
        { label: "Rewards", note: ["What did I have to do", "to get praise?"] },
        { label: "Safety", note: ["What did I have to do", "to feel safe?"] },
      ]}
      textVersion={
        <ul className="mt-1 list-disc pl-5">
          <li>Friends shortfall: people pleasers, chameleons, overachievers.</li>
          <li>Safety shortfall: avoiders, hyper-controllers, chronic apologizers.</li>
          <li>Rewards shortfall: approval seekers, performers, status chasers.</li>
        </ul>
      }
    />
  );
}

export function AuthorityTriangle() {
  return (
    <Triangle
      arrows
      title="The Authority Triangle"
      desc="Authority shown as a cycle of three parts. Internal behaviors, the five traits, drive the external effect, how others respond. Both rest on underlying habits in five areas, which feed back into the traits."
      caption="Fig. The Authority Triangle: traits drive effect, and habits hold both up"
      hub={["AUTHORITY"]}
      corners={[
        { label: "Internal", note: ["behavior:", "the five traits"] },
        { label: "External", note: ["effect: how", "others respond"] },
        { label: "Underlying", note: ["habits:", "the five areas"] },
      ]}
      textVersion={
        <ul className="mt-1 list-disc pl-5">
          <li>Internal behaviors: confidence, discipline, leadership, gratitude, enjoyment.</li>
          <li>External effect: how other people respond to us.</li>
          <li>Underlying habits: environment, time, appearance, social, financial.</li>
        </ul>
      }
    />
  );
}
