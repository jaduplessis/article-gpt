doc = """
# Achieving Observability Excellence in Multi-Team Serverless Projects — Beyond Silos

[https://cdn-images-1.medium.com/max/800/0*mAxbnbvcpCl9d1bo](https://cdn-images-1.medium.com/max/800/0*mAxbnbvcpCl9d1bo)

[José Ramos on Unsplash.com](https://unsplash.com/photos/BWCgQw25XUE)

Efficient log aggregation and analysis play a pivotal role in the realm of multi-team serverless projects. These capabilities are crucial for identifying domain-specific issues, closely monitoring the performance of applications within collaborative projects, and extracting valuable insights for informed decision-making. The intricacies of distributed systems, particularly those employing eventual consistency, introduce challenges related to tracking asynchronous events, ensuring data integrity, and maintaining real-time visibility due to their decentralised and stateless nature.

To illustrate the application of observability tools in a multi-team serverless project grappling with these challenges, let’s consider a scenario involving an e-commerce platform with distinct services like a payments service, orders service, and inventory service.

### Example Scenario: Multi-Team Serverless E-commerce Platform Project

Imagine a sophisticated e-commerce platform where various services collaborate to provide users with a frictionless experience. This platform is comprised of a payments service responsible for handling transactions, an orders service managing product reservations, and an inventory service handling product availability. In this complex setup, efficient observability becomes paramount to ensure seamless collaboration among the teams and swift issue resolution.

![https://cdn-images-1.medium.com/max/800/1*ch5FsLcFGqtWL2zTddqL9Q.png](https://cdn-images-1.medium.com/max/800/1*ch5FsLcFGqtWL2zTddqL9Q.png)

Example E-Commerce Platform Diagram

To address the challenges of such a multi-team project setting, AWS provides a suite of services that empower developers to establish a unified, domain-centric view of logs, metrics, and events spanning their entire AWS Organisation. Additionally, third-party tools such as Lumigo, New Relic, DataDog, and Baselime can be instrumental in enhancing observability by providing specialised insights and diagnostics tailored to the unique needs of the e-commerce services.

### Native AWS Tools

In this section, we’ll delve into the native AWS tools — CloudWatch, X-Ray, and CloudTrail — each playing a crucial role in enhancing the observability of our e-commerce platform.

Within AWS’s extensive toolkit, CloudWatch stands as a fundamental service, offering a powerful monitoring and observability solution. In our e-commerce example, each service — payments, orders, and inventory — can leverage CloudWatch to collect and present data, providing visibility into system behaviour, performance, and operational health. CloudWatch proves especially beneficial in managing the nuances of distributed systems by offering insights into asynchronous events and enabling real-time monitoring of dynamic, eventually consistent data flows. Many AWS services, including Lambda, are preconfigured to log to CloudWatch by default, simplifying the process of centralised log exploration in the AWS console.

![https://cdn-images-1.medium.com/max/800/0*qJzHGhRCNqbTT7Hx.png](https://cdn-images-1.medium.com/max/800/0*qJzHGhRCNqbTT7Hx.png)

*Summary of the CloudWatch vended metrics and logs options for each of the serverless services (*[aws.amazon.com](https://aws.amazon.com/blogs/mt/observability-using-native-amazon-cloudwatch-and-aws-x-ray-for-serverless-modern-applications/)*)*

AWS X-Ray becomes indispensable in our example scenario, providing insights into the performance of each service. Developers can trace requests as they traverse the payments, orders, and inventory services, pinpointing bottlenecks or errors in real-time. X-Ray’s ability to track asynchronous events and provide a visual representation of the application’s architecture is particularly valuable in addressing challenges related to distributed systems. This allows for optimising performance and reliability, ensuring a smooth shopping experience for users.

![https://cdn-images-1.medium.com/max/800/1*HDUQqV05rsWK_AT0FsTECg.png](https://cdn-images-1.medium.com/max/800/1*HDUQqV05rsWK_AT0FsTECg.png)

An example X-Ray Trace as seen in the AWS Console ([docs.aws.amazon.com](https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html#xray-concepts-subsegments))

AWS CloudTrail records detailed logs of every action within the AWS environment. In our e-commerce platform, CloudTrail offers essential insights into the interactions between the payments, orders, and inventory services, ensuring transparency and security in every transaction. Importantly, CloudTrail specialises in recording Management Events, providing a detailed history of modifications made to the system, such as changes to security groups, IAM policies, or resource configurations. This feature differentiates CloudTrail from CloudWatch, which primarily focuses on monitoring operational data and application performance.

### Cross-Account Observability

Cross-Account Observability, a transformative feature within CloudWatch, has reshaped the landscape of monitoring and management for organisations. In our e-commerce scenario, this feature allows for the creation of a central monitoring account that seamlessly integrates with the payments, orders, and inventory services, providing a strategic solution to the challenges posed by distributed and stateless serverless architectures.

![https://cdn-images-1.medium.com/max/800/1*1v1xzu7-L6xcL5W1EuT7Dw.png](https://cdn-images-1.medium.com/max/800/1*1v1xzu7-L6xcL5W1EuT7Dw.png)

E-Commerce Example Account Setup

The strength of Cross-Account Observability lies in its ability to aggregate and consolidate essential observability data from across AWS organisations. In our e-commerce example, this comprehensive approach ensures the effortless gathering of performance metrics, detailed logs, and intricate traces of requests as they traverse the serverless application. All this invaluable information is funnelled into a centralised monitoring account, offering an unobstructed view of the entire architecture’s health and performance, ensuring that each transaction is secure and smooth.

### Third-Party Platforms

Third-party platforms expand the range of observability tools available. In our e-commerce project, these platforms empower each team (payments, orders, and inventory) to select observability solutions that align precisely with their specific needs and expertise. This adaptability ensures that each team can leverage the most suitable third-party observability tools, resulting in a more tailored and effective approach to addressing issues and delivering a seamless shopping experience.

![https://cdn-images-1.medium.com/max/800/1*7QYxODX5AR8pQpXQAVOzCA.png](https://cdn-images-1.medium.com/max/800/1*7QYxODX5AR8pQpXQAVOzCA.png)

Lumigo Dashboard ([docs.lumigo.io](https://docs.lumigo.io/docs/dashboard))

### Synergising Tools for an Optimal Approach

The synergy of CloudWatch with Cross-Account Observability presents a potent strategy for precisely identifying issue origins within the payments, orders, and inventory services of our e-commerce platform. This collaborative approach centralises performance and error data, simplifying the process of identifying affected domains during problem occurrences. It seamlessly integrates CloudWatch’s real-time monitoring capabilities with Cross-Account Observability’s capacity to gather data from diverse sources across the AWS Organisation. The result is an all-encompassing view that allows for more efficient issue pinpointing and resolution, ensuring that customers can complete their transactions without interruptions.

Once an issue is located, the next step involves empowering teams to perform further investigations using their preferred observability tools. This flexibility is crucial, as it ensures that each team can utilise observability tools that align precisely with their specific needs and expertise. This approach allows them to delve deeply into the issue using familiar toolsets. In our e-commerce example, this not only enhances their efficiency in diagnosing and resolving problems unique to their domains but also fosters a sense of ownership and autonomy within each team.

When it comes to budgeting, it’s essential to be mindful of the cost implications of this synergistic approach. While CloudWatch offers a robust set of native tools, including a free tier, additional costs may be incurred as monitoring requirements scale. In addition, the adoption of third-party observability tools introduces another layer of cost. These tools often operate on subscription models or usage-based pricing, and their costs should be factored into the overall observability budget. Evaluating and understanding these cost factors upfront allows for effective budgeting and optimisation of resource utilisation.

Moreover, in the realm of permissions, orchestrating the collaboration between teams working on payments, orders, and inventory services introduces another layer of complexity. Each team requires specific permissions to access and analyse relevant observability data. Configuring these permissions demands careful consideration to ensure that teams have the necessary access without compromising security protocols. Establishing well-defined permission structures is imperative for fostering a collaborative yet secure environment.

### Conclusion

Achieving observability excellence in multi-team serverless projects, exemplified by our e-commerce platform, demands an approach that aligns seamlessly with the intricacies of the architecture. CloudWatch with Cross-Account Observability, in tandem with third-party platforms, offers a robust foundation to achieve just that. In our e-commerce project, this holistic approach facilitates centralised monitoring, efficient issue identification, and tailored issue resolution. By harnessing these observability tools, including third-party platforms, and encouraging teams in the payments, orders, and inventory services to use their preferred solutions, you empower each team to take ownership of its observability needs. This ultimately contributes to a more agile, responsive, and resilient architecture. By embracing these powerful tools and fostering a culture of collaboration, each team can confidently navigate the challenges of multi-team serverless projects in this ever-evolving landscape.

"""