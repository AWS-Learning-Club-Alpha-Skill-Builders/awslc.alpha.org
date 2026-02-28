export type TrackTheme =
	| 'cloud'
	| 'cybersec'
	| 'aiml'
	| 'data'
	| 'swe'
	| 'iot'
	| 'gamedev'
	| 'uiux'

export interface SkillModule {
	id: string
	name: string
	link: string
	description: string
}

export interface Track {
	id: string
	name: string
	emoji: string
	themeKey: TrackTheme
	shortDescription: string
	longDescription: string
	modules: SkillModule[]
}

export const TRACKS: Track[] = [
	{
		id: 'cloud',
		name: 'Cloud & Infrastructure',
		emoji: '☁️',
		themeKey: 'cloud',
		shortDescription: 'Build and secure AWS cloud infrastructure from the ground up.',
		longDescription:
			'Learn the foundational AWS services that power modern cloud infrastructure. From setting up your account and securing it with IAM, to designing and deploying Virtual Private Clouds — this track builds the practical skills every cloud engineer needs.',
		modules: [
			{
				id: 'cloud-1',
				name: 'Set Up An AWS Account for Free',
				link: 'https://learn.nextwork.org/projects/aws-account-setup',
				description:
					'Create and configure your first free-tier AWS account to start building.',
			},
			{
				id: 'cloud-2',
				name: 'Cloud Security with AWS IAM',
				link: 'https://learn.nextwork.org/projects/aws-security-iam',
				description:
					'Learn identity and access management to control who can do what on AWS.',
			},
			{
				id: 'cloud-3',
				name: 'Build a Virtual Private Cloud',
				link: 'https://learn.nextwork.org/projects/aws-networks-vpc',
				description:
					'Design isolated network environments in AWS using VPC subnets and routing.',
			},
			{
				id: 'cloud-4',
				name: 'VPC Traffic Flow and Security',
				link: 'https://learn.nextwork.org/projects/aws-networks-security',
				description:
					'Configure security groups and NACLs to control traffic in your VPC.',
			},
			{
				id: 'cloud-5',
				name: 'Creating a Private Subnet',
				link: 'https://learn.nextwork.org/projects/aws-networks-private',
				description:
					'Set up private subnets to isolate backend resources from the public internet.',
			},
			{
				id: 'cloud-6',
				name: 'Launching VPC Resources',
				link: 'https://learn.nextwork.org/projects/aws-networks-ec2',
				description:
					'Deploy EC2 instances and resources inside a fully configured VPC.',
			},
		],
	},
	{
		id: 'cybersec',
		name: 'CyberSecurity',
		emoji: '🔒',
		themeKey: 'cybersec',
		shortDescription:
			'Protect cloud environments with AWS security fundamentals.',
		longDescription:
			'Develop the mindset and technical skills to secure cloud infrastructure. This track covers identity management, network security, and threat prevention using AWS native services — essential knowledge for any cloud security practitioner.',
		modules: [
			{
				id: 'cybersec-1',
				name: 'Set Up An AWS Account for Free',
				link: 'https://learn.nextwork.org/projects/aws-account-setup',
				description:
					'Create and configure your first free-tier AWS account to start building.',
			},
			{
				id: 'cybersec-2',
				name: 'Cloud Security with AWS IAM',
				link: 'https://learn.nextwork.org/projects/aws-security-iam',
				description:
					'Learn identity and access management to control who can do what on AWS.',
			},
			{
				id: 'cybersec-3',
				name: 'Build a Virtual Private Cloud',
				link: 'https://learn.nextwork.org/projects/aws-networks-vpc',
				description:
					'Design isolated network environments in AWS using VPC subnets and routing.',
			},
			{
				id: 'cybersec-4',
				name: 'VPC Traffic Flow and Security',
				link: 'https://learn.nextwork.org/projects/aws-networks-security',
				description:
					'Configure security groups and NACLs to control traffic in your VPC.',
			},
			{
				id: 'cybersec-5',
				name: 'Creating a Private Subnet',
				link: 'https://learn.nextwork.org/projects/aws-networks-private',
				description:
					'Set up private subnets to isolate backend resources from the public internet.',
			},
			{
				id: 'cybersec-6',
				name: 'Launching VPC Resources',
				link: 'https://learn.nextwork.org/projects/aws-networks-ec2',
				description:
					'Deploy EC2 instances and resources inside a fully configured VPC.',
			},
		],
	},
	{
		id: 'aiml',
		name: 'AI / ML',
		emoji: '🤖',
		themeKey: 'aiml',
		shortDescription: 'Build intelligent applications and AI workflows using AWS.',
		longDescription:
			'Explore the intersection of cloud computing and artificial intelligence. From prompt engineering and no-code AI workflows to RAG chatbots on Bedrock, this track equips you to build and deploy AI-powered solutions on AWS.',
		modules: [
			{
				id: 'aiml-1',
				name: 'Set Up An AWS Account for Free',
				link: 'https://learn.nextwork.org/projects/aws-account-setup',
				description:
					'Create and configure your first free-tier AWS account to start building.',
			},
			{
				id: 'aiml-2',
				name: 'Cloud Security with AWS IAM',
				link: 'https://learn.nextwork.org/projects/aws-security-iam',
				description:
					'Learn identity and access management to control who can do what on AWS.',
			},
			{
				id: 'aiml-3',
				name: 'AI Prompt Engineering Beginner',
				link: 'https://learn.nextwork.org/projects/ai-promptengineering-beginner',
				description:
					'Craft effective prompts to get better results from AI language models.',
			},
			{
				id: 'aiml-4',
				name: 'Build Your First AI Workflow',
				link: 'https://learn.nextwork.org/projects/ai-agent-nocode',
				description:
					'Automate tasks by building a no-code AI workflow from scratch.',
			},
			{
				id: 'aiml-5',
				name: 'Set Up a RAG Chatbot in Bedrock',
				link: 'https://learn.nextwork.org/projects/ai-rag-bedrock',
				description:
					'Build a retrieval-augmented generation chatbot using Amazon Bedrock.',
			},
			{
				id: 'aiml-6',
				name: 'AI Coding with Cursor',
				link: 'https://learn.nextwork.org/projects/ai-workspace-cursor',
				description:
					'Accelerate development by using AI-assisted coding with Cursor IDE.',
			},
		],
	},
	{
		id: 'data',
		name: 'Data Science',
		emoji: '📊',
		themeKey: 'data',
		shortDescription:
			'Master data engineering, SQL, and AWS database services.',
		longDescription:
			'Understand the full data engineering lifecycle — from generation and ingestion to storage, transformation, and querying. This track blends core SQL skills with hands-on AWS database projects using DynamoDB and data warehouse concepts.',
		modules: [
			{
				id: 'data-1',
				name: 'What is Data Engineering?',
				link: 'https://www.ibm.com/think/topics/data-engineering',
				description:
					'Get an overview of data engineering and its role in modern organizations.',
			},
			{
				id: 'data-2',
				name: 'How to Become a Data Engineer',
				link: 'https://www.datacamp.com/blog/how-to-become-a-data-engineer',
				description:
					'Explore the skills, tools, and career path of a professional data engineer.',
			},
			{
				id: 'data-3',
				name: 'Data Engineering Explained',
				link: 'https://www.youtube.com/watch?v=qWru-b6m030',
				description:
					'Watch a concise video breakdown of data engineering concepts and workflows.',
			},
			{
				id: 'data-4',
				name: 'Data Scientist vs Data Engineer',
				link: 'https://www.datacamp.com/blog/data-scientist-vs-data-engineer',
				description:
					'Understand the key differences between data scientist and data engineer roles.',
			},
			{
				id: 'data-5',
				name: 'The Concept of Data Generation',
				link: 'https://www.marktechpost.com/2023/02/27/the-concept-of-data-generation/',
				description:
					'Learn how data is created, collected, and prepared for downstream use.',
			},
			{
				id: 'data-6',
				name: 'Data Storage Concepts',
				link: 'https://www.ibm.com/think/topics/data-storage',
				description:
					'Explore different data storage architectures and when to use each.',
			},
			{
				id: 'data-7',
				name: 'Data Ingestion',
				link: 'https://www.ibm.com/think/topics/data-ingestion',
				description:
					'Understand pipelines and tools used to move data into storage systems.',
			},
			{
				id: 'data-8',
				name: 'Data Engineering Lifecycle',
				link: 'https://medium.com/towards-data-engineering/data-engineering-lifecycle-d1e7ee81632e',
				description:
					'Trace the complete journey of data from raw source to actionable insight.',
			},
			{
				id: 'data-9',
				name: 'SQL SELECT',
				link: 'https://www.w3schools.com/sql/sql_select.asp',
				description:
					'Query specific columns and rows from database tables using SELECT.',
			},
			{
				id: 'data-10',
				name: 'SQL WHERE',
				link: 'https://www.w3schools.com/sql/sql_where.asp',
				description:
					'Filter query results using conditional logic with the WHERE clause.',
			},
			{
				id: 'data-11',
				name: 'SQL ORDER BY',
				link: 'https://www.w3schools.com/sql/sql_orderby.asp',
				description:
					'Sort query results in ascending or descending order using ORDER BY.',
			},
			{
				id: 'data-12',
				name: 'SQL AND',
				link: 'https://www.w3schools.com/sql/sql_and.asp',
				description:
					'Combine multiple conditions in a query using the AND logical operator.',
			},
			{
				id: 'data-13',
				name: 'SQL OR',
				link: 'https://www.w3schools.com/sql/sql_or.asp',
				description:
					'Return rows matching any of multiple conditions using the OR operator.',
			},
			{
				id: 'data-14',
				name: 'SQL JOIN',
				link: 'https://www.w3schools.com/sql/sql_join.asp',
				description:
					'Combine rows from multiple tables based on a related column with JOIN.',
			},
			{
				id: 'data-15',
				name: 'SQL INNER JOIN',
				link: 'https://www.w3schools.com/sql/sql_join_inner.asp',
				description:
					'Return only matching rows from both tables using INNER JOIN.',
			},
			{
				id: 'data-16',
				name: 'SQL LEFT JOIN',
				link: 'https://www.w3schools.com/sql/sql_join_left.asp',
				description:
					'Return all rows from the left table plus matching rows from the right.',
			},
			{
				id: 'data-17',
				name: 'SQL RIGHT JOIN',
				link: 'https://www.w3schools.com/sql/sql_join_right.asp',
				description:
					'Return all rows from the right table plus matching rows from the left.',
			},
			{
				id: 'data-18',
				name: 'What is a Data Warehouse?',
				link: 'https://www.oracle.com/database/what-is-a-data-warehouse/',
				description:
					'Learn how data warehouses store and organize large datasets for analytics.',
			},
			{
				id: 'data-19',
				name: 'Data Warehouse Tutorial',
				link: 'https://www.youtube.com/watch?v=sigLQluRuzw',
				description:
					'Follow a video tutorial to set up and query a basic data warehouse.',
			},
			{
				id: 'data-20',
				name: 'Data Pipeline Tutorial',
				link: 'https://www.youtube.com/watch?v=DlBUuWBfnTs',
				description:
					'Build an end-to-end data pipeline that moves and transforms data.',
			},
			{
				id: 'data-21',
				name: 'Query Data with DynamoDB',
				link: 'https://learn.nextwork.org/projects/aws-databases-query',
				description:
					'Write queries against a NoSQL DynamoDB table using the AWS console.',
			},
			{
				id: 'data-22',
				name: 'Load Data into DynamoDB',
				link: 'https://learn.nextwork.org/projects/aws-databases-dynamodb',
				description:
					'Import and insert structured data into an Amazon DynamoDB table.',
			},
			{
				id: 'data-23',
				name: 'AWS Database Tutorial Playlist',
				link: 'https://www.youtube.com/watch?v=9GVqKuTVANE&list=PLNcg_FV9n7qaUWeyUkPfiVtMbKlrfMqA8',
				description:
					'Watch a curated playlist covering core AWS database services and patterns.',
			},
		],
	},
	{
		id: 'swe',
		name: 'Software Engineering',
		emoji: '💻',
		themeKey: 'swe',
		shortDescription:
			'Deploy production apps with AWS DevOps and CI/CD pipelines.',
		longDescription:
			'Follow a complete software delivery workflow using AWS developer tools. Build CI/CD pipelines with CodeBuild and CodeDeploy, manage infrastructure as code with CloudFormation, and automate end-to-end delivery with CodePipeline.',
		modules: [
			{
				id: 'swe-1',
				name: 'Set Up An AWS Account for Free',
				link: 'https://learn.nextwork.org/projects/aws-account-setup',
				description:
					'Create and configure your first free-tier AWS account to start building.',
			},
			{
				id: 'swe-2',
				name: 'Cloud Security with AWS IAM',
				link: 'https://learn.nextwork.org/projects/aws-security-iam',
				description:
					'Learn identity and access management to control who can do what on AWS.',
			},
			{
				id: 'swe-3',
				name: 'Build a CI/CD Pipeline with AWS',
				link: 'https://learn.nextwork.org/projects/aws-devops-cicd',
				description:
					'Set up automated build and deployment pipelines using AWS DevOps tools.',
			},
			{
				id: 'swe-4',
				name: 'Set Up a Web App in the Cloud',
				link: 'https://learn.nextwork.org/projects/aws-devops-vscode',
				description:
					'Deploy a web application to EC2 using VS Code and cloud development tools.',
			},
			{
				id: 'swe-5',
				name: 'Connect a GitHub Repo with AWS',
				link: 'https://learn.nextwork.org/projects/aws-devops-github',
				description:
					'Integrate GitHub repositories with AWS for source control and automation.',
			},
			{
				id: 'swe-6',
				name: 'Manage Packages with CodeArtifact',
				link: 'https://learn.nextwork.org/projects/aws-devops-codeartifact-updated',
				description:
					'Use AWS CodeArtifact to host and share software packages securely.',
			},
			{
				id: 'swe-7',
				name: 'Build with AWS CodeBuild',
				link: 'https://learn.nextwork.org/projects/aws-devops-codebuild-updated',
				description:
					'Compile and test your application code automatically using CodeBuild.',
			},
			{
				id: 'swe-8',
				name: 'Deploy a Web App with CodeDeploy',
				link: 'https://learn.nextwork.org/projects/aws-devops-codedeploy-updated',
				description:
					'Automate application deployments to EC2 instances with CodeDeploy.',
			},
			{
				id: 'swe-9',
				name: 'Infrastructure as Code with CloudFormation',
				link: 'https://learn.nextwork.org/projects/aws-devops-cloudformation-updated',
				description:
					'Define and provision AWS resources using declarative CloudFormation templates.',
			},
			{
				id: 'swe-10',
				name: 'Automate with AWS CodePipeline',
				link: 'https://learn.nextwork.org/projects/aws-devops-codepipeline-updated',
				description:
					'Build a fully automated release pipeline using AWS CodePipeline.',
			},
		],
	},
	{
		id: 'iot',
		name: 'IoT & Robotics',
		emoji: '🔧',
		themeKey: 'iot',
		shortDescription:
			'Connect physical devices to the cloud with AWS IoT services.',
		longDescription:
			'Explore IoT and robotics modules powered by AWS. This track is currently being curated by the team — exciting projects connecting hardware to cloud are coming soon.',
		modules: [
			{
				id: 'iot-1',
				name: 'IoT & Robotics modules coming soon',
				link: '#',
				description:
					'Placeholder for upcoming IoT and robotics hands-on modules.',
			},
		],
	},
	{
		id: 'gamedev',
		name: 'Game Development',
		emoji: '🎮',
		themeKey: 'gamedev',
		shortDescription:
			'Create games with Unreal Engine, Unity, and Roblox Studio.',
		longDescription:
			'Dive into game development using industry-standard tools. This track covers Unreal Engine 5 blueprints, 3D modeling with Maya and Unity, and game scripting in Roblox Studio — practical projects to kickstart your game dev journey.',
		modules: [
			{
				id: 'gamedev-1',
				name: 'Unreal Engine 5 Blueprints for Beginners',
				link: 'https://www.skillshare.com/en/classes/unreal-engine-5-blueprints-for-beginners-create-video-games-and-interactive-media/648191339',
				description:
					'Build interactive game mechanics using UE5\'s visual scripting system.',
			},
			{
				id: 'gamedev-2',
				name: 'Maya and Unity 3D Modeling for Mobile Games',
				link: 'https://www.skillshare.com/en/classes/maya-and-unity-3d-modeling-environment-for-mobile-game/626152152',
				description:
					'Create 3D assets in Maya and integrate them into Unity for mobile games.',
			},
			{
				id: 'gamedev-3',
				name: 'Beginner Roblox and Lua: Making Games',
				link: 'https://www.skillshare.com/en/classes/beginner-roblox-and-lua-start-making-games-with-roblox-studio/1724954249/projects',
				description:
					'Script Roblox games using Lua and Roblox Studio\'s development environment.',
			},
		],
	},
	{
		id: 'uiux',
		name: 'UI/UX',
		emoji: '🎨',
		themeKey: 'uiux',
		shortDescription: 'Design intuitive user interfaces using Figma essentials.',
		longDescription:
			'Learn the core principles of UI/UX design using Figma, the industry\'s leading design tool. This track covers component design, prototyping, and design systems — skills that bridge the gap between developers and designers.',
		modules: [
			{
				id: 'uiux-1',
				name: 'Figma UI/UX Design Essentials',
				link: 'https://www.skillshare.com/en/classes/figma-ui-ux-design-essentials/1088693386',
				description:
					'Design screens, components, and prototypes using Figma\'s core tools.',
			},
		],
	},
]
