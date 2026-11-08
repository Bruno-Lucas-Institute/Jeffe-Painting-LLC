export function Process() {
	return (
		<section className="section process-section">
			<div className="process-heading">
				<p className="eyebrow">
					<span className="eyebrow-line" /> The process
				</p>
				<h2>
					Easy to start.
					<br />
					<em>Good to come home to.</em>
				</h2>
				<p>
					Clear communication and respectful work are part of a job
					well done. Here is what getting started looks like.
				</p>
			</div>
			<div className="process-steps">
				{[
					[
						"01",
						"Tell us about it",
						"Share a few details about your project and where you're located.",
					],
					[
						"02",
						"Get a clear estimate",
						"We'll talk through the work and give you a straightforward quote.",
					],
					[
						"03",
						"Enjoy the refresh",
						"Our crew takes care of the details, from prep through final walkthrough.",
					],
				].map(([number, title, description]) => (
					<div className="process-step" key={number}>
						<span className="step-number">{number}</span>
						<h3>{title}</h3>
						<p>{description}</p>
					</div>
				))}
			</div>
		</section>
	);
}
