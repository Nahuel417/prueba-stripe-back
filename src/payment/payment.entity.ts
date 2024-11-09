import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
// import { User } from 'src/user/user.entity';
// import { PostedJob } from 'src/postedJob/postedJob.entity';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('float', { nullable: false })
    amount: number;

    @Column('varchar', { length: 3, nullable: false })  
    currency: string;

    @Column('varchar', { length: 20, default: 'pendiente' }) 
    status: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('varchar', { length: 255, nullable: true }) 
    reason: string;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @Column('float', { nullable: false })
    clientId: number;

    @Column('float', { nullable: false })
    professionalId: number;

    @Column('float', { nullable: false })
    postedJobId: number;

    // @ManyToOne(() => User, (user) => user.payments)
    // @JoinColumn({ name: 'clientId' })
    // client: User;

    // @ManyToOne(() => User, (user) => user.receivedPayments)
    // @JoinColumn({ name: 'professionalId' })
    // professional: User;

    // @ManyToOne(() => PostedJob, (postedJob) => postedJob.payments)
    // @JoinColumn({ name: 'postedJobId' })
    // postedJob: PostedJob;
}

